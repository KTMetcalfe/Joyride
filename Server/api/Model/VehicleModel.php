<?php
require_once "/joyride/api/Model/Database.php";

class VehicleModel extends Database {
  public function listVehicles() {
    return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s'", "YES"));
  }

  public function listVehiclesLimited($offset, $limit) {
    return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s' LIMIT %d, %d", "YES", $offset, $limit));
  }

  public function checkVehicles($ids) {
    $out = "";
    foreach($ids as $id) {
      $out .= sprintf(" OR id=%d", $id);
    }
    $out = substr($out, 4);

    return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s' AND (%s)", "YES", $out));
  }

  public function listVehiclesAdmin() {
    return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s'", "NO"));
  }

  public function listVehiclesAdminLimited($offset, $limit) {
    return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s' LIMIT %d, %d", "NO", $offset, $limit));
  }

  public function checkVehiclesAdmin($ids) {
    $out = "";
    foreach($ids as $id) {
      $out .= sprintf(" OR id=%d", $id);
    }
    $out = substr($out, 4);

    return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s' AND (%s)", "YES", $out));
  }

  public function addVehicle($make, $model, $mileage, $price, $year, $capacity, $user) {
    return $this->insert(sprintf("INSERT INTO vehicles (make, model, mileage, price, model_year, capacity, user) VALUES ('%s', '%s', %d, %d, %d, %d, '%s')", $make, $model, $mileage, $price, $year, $capacity, $user));
  }

  public function approveVehicle($id) {
    return $this->insert(sprintf("UPDATE vehicles SET approved='%s' WHERE id=%d", "YES", $id));
  }

  public function removeVehicle($id) {
    return $this->insert(sprintf("DELETE FROM vehicles WHERE id=%d", $id));
  }

  public function updateVehicle($id, $make, $model, $mileage, $price, $year, $capacity) {
    return $this->insert(sprintf("UPDATE vehicles SET make='%s', model='%s', mileage=%d, price=%d, model_year=%d, capacity=%d WHERE id=%d", $make, $model, $mileage, $price, $year, $capacity, $id));
  }

  public function getVehicle($id) {
    return $this->select(sprintf("SELECT * FROM vehicles WHERE id=%d", $id));
  }
}
