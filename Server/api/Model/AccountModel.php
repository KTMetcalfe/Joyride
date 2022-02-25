<?php
require_once "/joyride/api/Model/Database.php";

class AccountModel extends Database {
    public function getAccount($user) {
        return $this->select(sprintf("SELECT * FROM accounts WHERE user='%s'", $user));
    }

    public function addAccount($email, $user, $pass) {
        return $this->insert(sprintf("INSERT INTO accounts (email, user, pass) VALUES ('%s', '%s', '%s')", $email, $user, $pass));
    }
}
?>