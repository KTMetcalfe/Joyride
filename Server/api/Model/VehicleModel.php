<?php
require_once "/joyride/api/Model/Database.php";

class VehicleModel extends Database {
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
      $out .= ' AND transmission = ' . $filter->{'mileage_end'};
    }

    if ($filter->{'vehicle_color'} != null) {
      $out .= ' AND color = ' . $filter->{'vehicle_color'};
    }

    if ($filter->{'make'} != null) {
      $out .= ' AND make = ' . $filter->{'make'};
    }

    if ($filter->{'model'} != null) {
      $out .= ' AND model = ' . $filter->{'model'};
    }

    if ($filter->{'rating_start'} != null) {
      $out .= ' AND rating >= ' . $filter->{'rating_start'};
    }

    if ($filter->{'powertrains_list'} != null) {
      foreach ($filter->{'powertrains_list'} as $powertrain) {
        $out .= ' AND powertrains LIKE "%' . $powertrain . '%"';
      }
    }

    if ($filter->{'vehicle_types_list'} != null) {
      foreach ($filter->{'vehicle_types_list'} as $vehicle_type) {
        $out .= ' AND vehicle_types LIKE "%' . $vehicle_type . '%"';
      }
    }

    if ($filter->{'vehicle_options_list'} != null) {
      foreach ($filter->{'vehicle_options_list'} as $vehicle_option) {
        $out .= ' AND vehicle_options LIKE "%' . $vehicle_option . '%"';
      }
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
  public function addVehicle($make, $model, $mileage, $price, $year, $capacity, $user, $imageCount) {
    $images = [];
    for ($i = 0; $i < $imageCount; $i++) {
      array_push($images, $i);
    }

    $this->insert(sprintf("INSERT INTO vehicles (make, model, mileage, price, model_year, capacity, user, images) VALUES ('%s', '%s', %d, %d, %d, %d, '%s', '%s')", $make, $model, $mileage, $price, $year, $capacity, $user, json_encode($images)));
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
