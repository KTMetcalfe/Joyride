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
}
?>