<?php
require_once "/joyride/api/Model/Database.php";

class AccountModel extends Database {
    public function getAccount($user) {
        return $this->select(sprintf("SELECT * FROM accounts WHERE user='%s'", $user));
    }

    public function addAccount($email, $user, $pass) {
        return $this->insert(sprintf("INSERT INTO accounts (email, user, pass) VALUES ('%s', '%s', '%s')", $email, $user, $pass));
    }

    public function getFavorites($user) {
        $accounts = $this->select(sprintf("SELECT favorites FROM accounts WHERE user='%s'", $user));

        if ($accounts[0]['favorites'] != null) {
            $favorites = json_decode($accounts[0]['favorites']);

            if (gettype($favorites) == "array" && count($favorites) > 0) {
                $out = "";
                foreach ($favorites as $id) {
                    $out .= sprintf(" OR id=%f", $id);
                }
                $out = substr($out, 4);
        
                return $this->select("SELECT * FROM vehicles WHERE " . $out);
            };
        }
        return [];
    }

    public function addFavorite($user, $id) {
        $accounts = $this->select(sprintf("SELECT favorites FROM accounts WHERE user='%s'", $user));

        if ($accounts[0]['favorites'] != null) {
            $favorites = json_decode($accounts[0]['favorites']);

            if (gettype($favorites) == "array" && count($favorites) > 0) {
                if (array_search($id, $favorites) === false) {
                    array_push($favorites, $id);

                    return $this->insert(sprintf("UPDATE accounts SET favorites='%s' WHERE user='%s'", json_encode(array_values($favorites)), $user));
                } else {
                    exit;
                }
            }
        }

        return $this->insert(sprintf("UPDATE accounts SET favorites='[%f]' WHERE user='%s'", $id, $user));
    }

    public function removeFavorite($user, $id) {
        $accounts = $this->select(sprintf("SELECT favorites FROM accounts WHERE user='%s'", $user));

        if ($accounts[0]['favorites'] != null) {
            $favorites = json_decode($accounts[0]['favorites']);

            if (gettype($favorites) == "array" && count($favorites) > 0) {
                if (($key = array_search($id, $favorites)) !== false) {
                    unset($favorites[$key]);
                    return $this->insert(sprintf("UPDATE accounts SET favorites='%s' WHERE user='%s'", json_encode(array_values($favorites)), $user));
                } else {
                    exit;
                }
            }
        }
    }
}
?>