<?php
require_once "/joyride/api/Model/Database.php";

class UserModel extends Database {
    public function getUsers($limit) {
        return $this->select('SELECT * FROM accounts LIMIT ?', ['i', $limit]);
    }
}
?>