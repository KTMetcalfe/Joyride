<?php
require_once "/joyride/api/Model/Database.php";

class VehicleModel extends Database {
  public function submitRating($id, $rating, $user) {
    // Adding to user
    $ratingElement = ["id" => $id, "rating" => $rating];

    $accounts = $this->select(sprintf("SELECT ratings FROM accounts WHERE user='%s'", $user));

    $ratings = json_decode($accounts[0]['ratings']);
    if (gettype($ratings) == "array" && count($ratings) > 0) {
      $index = array_search($id, array_column($ratings, 'id'));

      if (!is_numeric($index)) {
        array_push($ratings, $ratingElement);

        $this->insert(sprintf("UPDATE accounts SET ratings='%s' WHERE user='%s'", json_encode($ratings), $user));

        // Adding to vehicle
        $currRatings = $this->select(sprintf("SELECT rating, rating_count FROM vehicles WHERE id=%d", $id));

        $currCount = $currRatings[0]['rating_count'];
        $currRating = $currRatings[0]['rating'];

        $newCount = $currCount + 1;
        $newRating = (($currRating * $currCount) + $rating) / $newCount;

        $this->insert(sprintf("UPDATE vehicles SET rating=%2.1f, rating_count=%d WHERE id=%d", $newRating, $newCount, $id));
      }
    } else {
      $this->insert(sprintf("UPDATE accounts SET ratings='%s' WHERE user='%s'", json_encode([$ratingElement]), $user));
    }
  }

  public function removeRating($id, $rating, $user) {
    // Removing from user
    $accounts = $this->select(sprintf("SELECT ratings FROM accounts WHERE user='%s'", $user));

    $ratings = json_decode($accounts[0]['ratings']);
    if (gettype($ratings) == "array" && count($ratings) > 0) {
      $index = array_search($id, array_column($ratings, 'id'));

      if (is_numeric($index)) {
        unset($ratings[$index]);

        $this->insert(sprintf("UPDATE accounts SET ratings='%s' WHERE user='%s'", json_encode($ratings), $user));

        // Removing from vehicle
        $currRatings = $this->select(sprintf("SELECT rating, rating_count FROM vehicles WHERE id=%d", $id));

        $currCount = $currRatings[0]['rating_count'];
        $currRating = $currRatings[0]['rating'];

        $newCount = $currCount - 1;
        $newRating = (($currRating * $currCount) - $rating) / $newCount;

        $this->insert(sprintf("UPDATE vehicles SET rating=%2.1f, rating_count=%d WHERE id=%d", $newRating, $newCount, $id));
      }
    }
  }

  public function concatFilters($filter) {
    $out = "";

    if ($filter->{'year_start'} != null && $filter->{'year_end'} != null) {
      $out .= ' AND model_year BETWEEN ' . $filter->{'year_start'} . ' AND ' . $filter->{'year_end'};
    } else if ($filter->{'year_start'} != null) {
      $out .= ' AND model_year >= ' . $filter->{'year_start'};
    } else if ($filter->{'year_end'} != null) {
      $out .= ' AND model_year <= ' . $filter->{'year_end'};
    }

    if ($filter->{'price_start'} != null && $filter->{'price_end'} != null) {
      $out .= ' AND price BETWEEN ' . $filter->{'price_start'} . ' AND ' . $filter->{'price_end'};
    } else if ($filter->{'price_start'} != null) {
      $out .= ' AND price >= ' . $filter->{'price_start'};
    } else if ($filter->{'price_end'} != null) {
      $out .= ' AND price <= ' . $filter->{'price_end'};
    }

    if ($filter->{'capacity_start'} != null && $filter->{'capacity_end'} != null && $filter->{'capacity_end'} < 7) {
      $out .= ' AND capacity BETWEEN ' . $filter->{'capacity_start'} . ' AND ' . $filter->{'capacity_end'};
    } else if ($filter->{'capacity_start'} != null) {
      $out .= ' AND capacity >= ' . $filter->{'capacity_start'};
    } else if ($filter->{'capacity_end'} != null) {
      $out .= ' AND capacity <= ' . $filter->{'capacity_end'};
    }

    if ($filter->{'mileage_start'} != null && $filter->{'mileage_end'} != null) {
      $out .= ' AND mileage BETWEEN ' . $filter->{'mileage_start'} . ' AND ' . $filter->{'mileage_end'};
    } else if ($filter->{'mileage_start'} != null) {
      $out .= ' AND mileage >= ' . $filter->{'mileage_start'};
    } else if ($filter->{'mileage_end'} != null) {
      $out .= ' AND mileage <= ' . $filter->{'mileage_end'};
    }

    if ($filter->{'transmission_type'} != null) {
      $out .= ' AND transmission = "' . $filter->{'transmission_type'} . '"';
    }

    if ($filter->{'vehicle_color'} != null) {
      $out .= ' AND color = "' . $filter->{'vehicle_color'} . '"';
    }

    if ($filter->{'make'} != null) {
      $out .= ' AND make = "' . $filter->{'make'} . '"';
    }

    if ($filter->{'model'} != null) {
      $out .= ' AND model = "' . $filter->{'model'} . '"';
    }

    if ($filter->{'rating_start'} != null) {
      $out .= ' AND rating >= ' . $filter->{'rating_start'};
    }

    if ($filter->{'powertrains_list'} != null) {
      $out .= ' AND (';
      for ($i = 0; $i < count($filter->{'powertrains_list'}); $i++) {
        if ($i == 0) {
          $out .= 'powertrain LIKE "%' . $filter->{'powertrains_list'}[$i] . '%"';
        } else {
          $out .= ' OR powertrain LIKE "%' . $filter->{'powertrains_list'}[$i] . '%"';
        }
      }
      $out .= ')';
    }

    if ($filter->{'vehicle_types_list'} != null) {
      $out .= ' AND (';
      for ($i = 0; $i < count($filter->{'vehicle_types_list'}); $i++) {
        if ($i == 0) {
          $out .= 'vehicle_type LIKE "%' . $filter->{'vehicle_types_list'}[$i] . '%"';
        } else {
          $out .= ' OR vehicle_type LIKE "%' . $filter->{'vehicle_types_list'}[$i] . '%"';
        }
      }
      $out .= ')';
    }

    if ($filter->{'vehicle_options_list'} != null) {
      $out .= ' AND (';
      for ($i = 0; $i < count($filter->{'vehicle_options_list'}); $i++) {
        if ($i == 0) {
          $out .= 'vehicle_options LIKE "%' . $filter->{'vehicle_options_list'}[$i] . '%"';
        } else {
          $out .= ' AND vehicle_options LIKE "%' . $filter->{'vehicle_options_list'}[$i] . '%"';
        }
      }
      $out .= ')';
    }

    return $out;
  }

  // Returns a list of approved vehicles
  public function listVehicles() {
    return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s'", "YES"));
  }

  // Returns a limited list of approved vehicles
  public function listVehiclesLimited($offset, $limit) {
    return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s' LIMIT %d, %d", "YES", $offset, $limit));
  }

  // Returns a limited and filtered list of approved vehicles
  public function listVehiclesFiltered($filter, $offset, $limit) {
    $filter_string = $this->concatFilters($filter);

    return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s'%s LIMIT %d, %d", "YES", $filter_string, $offset, $limit));
  }

  // Checks for existence of an approved vehicles in SQL database
  public function checkVehicles($ids) {
    $out = "";
    foreach ($ids as $id) {
      $out .= sprintf(" OR id=%d", $id);
    }
    $out = substr($out, 4);

    return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s' AND (%s)", "YES", $out));
  }

  // Returns a list of unapproved vehicles
  public function listVehiclesAdmin() {
    return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s'", "NO"));
  }

  // Returns a limited list of unapproved vehicles
  public function listVehiclesAdminLimited($offset, $limit) {
    return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s' LIMIT %d, %d", "NO", $offset, $limit));
  }

  // Returns a limited and filtered list of unapproved vehicles
  public function listVehiclesAdminFiltered($filter, $offset, $limit) {
    $filter_string = $this->concatFilters($filter);

    return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s'%s LIMIT %d, %d", "NO", $filter_string, $offset, $limit));
  }

  // Checks for existence of an unapproved vehicles in SQL database
  public function checkVehiclesAdmin($ids) {
    $out = "";
    foreach ($ids as $id) {
      $out .= sprintf(" OR id=%d", $id);
    }
    $out = substr($out, 4);

    return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s' AND (%s)", "NO", $out));
  }

  // Inserts a new vehicle to the SQL database
  public function addVehicle($make, $model, $mileage, $price, $year, $capacity, $user, $imageCount, $color, $transmission, $powertrain, $vehicleType, $vehicleOptions) {
    $images = [];
    for ($i = 0; $i < $imageCount; $i++) {
      array_push($images, $i);
    }

    $this->insert(sprintf("INSERT INTO vehicles (make, model, mileage, price, model_year, capacity, user, images, color, transmission, powertrain, vehicle_type, vehicle_options) VALUES ('%s', '%s', %d, %d, %d, %d, '%s', '%s', '%s', '%s', '%s', '%s', '%s')", $make, $model, $mileage, $price, $year, $capacity, $user, json_encode($images), $color, $transmission, $powertrain, $vehicleType, $vehicleOptions));
    return $this->select("SELECT LAST_INSERT_ID();");
  }

  // Updates a vechiles approved tag to YES
  public function approveVehicle($id) {
    return $this->insert(sprintf("UPDATE vehicles SET approved='%s' WHERE id=%d", "YES", $id));
  }

  // Deletes a vehicle from the SQL database
  public function removeVehicle($id) {
    return $this->insert(sprintf("DELETE FROM vehicles WHERE id=%d", $id));
  }

  // Updates a vehicles information
  public function updateVehicle($id, $make, $model, $mileage, $price, $year, $capacity) {
    return $this->insert(sprintf("UPDATE vehicles SET make='%s', model='%s', mileage=%d, price=%d, model_year=%d, capacity=%d WHERE id=%d", $make, $model, $mileage, $price, $year, $capacity, $id));
  }

  // Returns a list of approved vehicles matching the vehicle id
  public function getVehicle($id) {
    return $this->select(sprintf("SELECT * FROM vehicles WHERE id=%d AND approved='%s'", $id, 'YES'));
  }

  // Returns a list of any vehicles matching the vehicle id
  public function getVehicleAdmin($id) {
    return $this->select(sprintf("SELECT * FROM vehicles WHERE id=%d", $id));
  }
}
