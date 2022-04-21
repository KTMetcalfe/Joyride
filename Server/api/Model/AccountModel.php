<?php

use PHPMailer\PHPMailer\PHPMailer;

require '/joyride/api/PHPMailer/src/Exception.php';
require '/joyride/api/PHPMailer/src/PHPMailer.php';
require '/joyride/api/PHPMailer/src/SMTP.php';

require_once "/joyride/api/Model/Database.php";

class AccountModel extends Database {
  // Sends a verification email to verify an account
  public function sendVerification($email) {
    $verification_code = rand(100000, 999999);

    $this->insert(sprintf("UPDATE accounts SET verification_code=%d WHERE email='%s'", $verification_code, $email));

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->SMTPDebug = 0;
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'kmetcalfe4@gmail.com';
    $mail->Password = 'olvewbmwkqzeedsy';
    $mail->SMTPSecure = 'tls';
    $mail->setFrom('noreply@joyride.kianm.net', 'Joyride');
    $mail->addAddress($email);
    $mail->Subject = 'Verify your Joyride account!';
    $mail->isHTML(true);
    $mail->Body = '<p>Click below to verify your email address!<br><a href="https://api.kianm.net/index.php/signup/verifyEmail?email=' . $email . '&code=' . $verification_code . '">Verify account</a></p>';
    $mail->Port = 587;

    try {
      $mail->send();
      return true;
    } catch (Exception $e) {
      return "Mailer Error: " . $mail->ErrorInfo . "\n";
    }
    return false;
  }

  // Verifies an account based off email code
  public function verifyAccount($email, $verification_code) {
    $accounts = $this->select(sprintf("SELECT * FROM accounts WHERE email='%s' AND verification_code=%d", $email, $verification_code));

    if (count($accounts) == 1) {
      $this->insert(sprintf("UPDATE accounts SET verified='%s', verification_code=NULL WHERE verification_code=%d AND email='%s'", "YES", $verification_code, $email));
      return true;
    }
    return false;
  }

  // Returns a list of matching accounts from SQL database
  public function getAccount($user) {
    return $this->select(sprintf("SELECT * FROM accounts WHERE user='%s'", $user));
  }

  // Inserts an account into SQL database
  public function addAccount($email, $user, $pass) {
    $this->insert(sprintf("INSERT INTO accounts (email, user, pass) VALUES ('%s', '%s', '%s')", $email, $user, $pass));
    return $this->sendVerification($email);
  }

  // Returns a list of ratings from mathcing account
  public function getRatings($user) {
    $accounts = $this->select(sprintf("SELECT ratings FROM accounts WHERE user='%s'", $user));

    $ratings = json_decode($accounts[0]['ratings']);
    if (gettype($ratings) == "array" && count($ratings) > 0) {
      return $ratings;
    }
    return [];
  }

  // Returns a list of vehicle ids from matching accounts
  public function getFavorites($user) {
    $accounts = $this->select(sprintf("SELECT favorites FROM accounts WHERE user='%s'", $user));

    if ($accounts[0]['favorites'] != '') {
      $favorites = json_decode($accounts[0]['favorites']);

      if (gettype($favorites) == "array" && count($favorites) > 0) {
        $out = "";
        foreach ($favorites as $id) {
          $out .= sprintf(" OR id=%d", $id);
        }
        $out = substr($out, 4);

        return $this->select("SELECT * FROM vehicles WHERE " . $out);
      };
    }
    return [];
  }

  // Reads and adds to the current favorites list on matching accounts
  public function addFavorite($user, $id) {
    $accounts = $this->select(sprintf("SELECT favorites FROM accounts WHERE user='%s'", $user));

    if ($accounts[0]['favorites'] != '') {
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

    return $this->insert(sprintf("UPDATE accounts SET favorites='[%d]' WHERE user='%s'", $id, $user));
  }

  // Reads and removes a vehicle id from the favorites list of matching accounts
  public function removeFavorite($user, $id) {
    $accounts = $this->select(sprintf("SELECT favorites FROM accounts WHERE user='%s'", $user));

    if ($accounts[0]['favorites'] != '') {
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
