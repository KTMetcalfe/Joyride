<?php
require_once "/joyride/api/Model/Database.php";

class VehicleModel extends Database {
    public function listVehicles() {
        return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s'", "YES"));
    }

    public function listVehiclesAdmin() {
        return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s'", "NO"));
    }

    public function addVehicle($make, $model, $mileage, $price, $year, $capacity, $user) {
        return $this->insert(sprintf("INSERT INTO vehicles (make, model, mileage, price, model_year, capacity, user) VALUES ('%s', '%s', %f, %f, %f, %f, '%s')", $make, $model, $mileage, $price, $year, $capacity, $user));
    }

    public function approveVehicle($id) {
        return $this->insert(sprintf("UPDATE vehicles SET approved='%s' WHERE id=%f", "YES", $id));
    }

    public function removeVehicle($id) {
        return $this->insert(sprintf("DELETE FROM vehicles WHERE id=%f", $id));
    }

    public function updateVehicle($id, $make, $model, $mileage, $price, $year, $capacity) {
        return $this->insert(sprintf("UPDATE vehicles SET make='%s', model='%s', mileage=%f, price=%f, model_year=%f, capacity=%f WHERE id=%f", $make, $model, $mileage, $price, $year, $capacity, $id));
    }

    public function getVehicle($id) {
        return $this->select(sprintf("SELECT * FROM vehicles WHERE id=%f", $id));
    }
}
?>