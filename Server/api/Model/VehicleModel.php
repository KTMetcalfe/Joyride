<?php
require_once "/joyride/api/Model/Database.php";

class VehicleModel extends Database {
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
    $yearStart = isset($filter->{'year_start'}) ? $filter->{'year_start'} : '';
    $yearEnd = isset($filter->{'year_end'}) ? $filter->{'year_end'} : '';

    $out = "";
    if ($yearStart != 0 && $yearEnd != 0) {
      $out .= ' AND model_year BETWEEN ' . $yearStart . ' AND ' . $yearEnd;
    } else if ($yearStart != 0) {
      $out .= ' AND model_year >= ' . $yearStart;
    } else if ($yearEnd != 0) {
      $out .= ' AND model_year <= ' . $yearEnd;
    }

    return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s'%s LIMIT %d, %d", "YES", $out, $offset, $limit));
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
    $out = "";

    if (isset($filter->{'year_start'}) && isset($filter->{'year_end'})) {
      $out .= ' AND model_year BETWEEN ' . $filter->{'year_start'} . ' AND ' . $filter->{'year_end'};
    } else if (isset($filter->{'year_start'})) {
      $out .= ' AND model_year > ' . $filter->{'year_start'};
    } else if (isset($filter->{'year_end'})) {
      $out .= ' AND model_year < ' . $filter->{'year_end'};
    }

    return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s'%s LIMIT %d, %d", "NO", $out, $offset, $limit));
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
