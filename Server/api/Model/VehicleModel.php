<?php
require_once "/joyride/api/Model/Database.php";

class VehicleModel extends Database {
    public function listVehicles() {
        return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s'", "YES"));
    }

    public function listVehiclesAdmin() {
        return $this->select(sprintf("SELECT * FROM vehicles WHERE approved='%s'", "NO"));
    }
}
?>