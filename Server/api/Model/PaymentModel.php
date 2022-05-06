<?php

use PHPMailer\PHPMailer\PHPMailer;

require_once '/joyride/PHPMailer/src/Exception.php';
require_once '/joyride/PHPMailer/src/PHPMailer.php';
require_once '/joyride/PHPMailer/src/SMTP.php';

require_once "/joyride/api/Model/Database.php";

// Request table query functions
class PaymentModel extends Database {
  // Creates a request for a vehicle
  public function createRequest($customer_id, $payment_id, $vehicle_id, $request_type, $price, $buyer, $seller) {
    return $this->insert(sprintf(
      "INSERT INTO requests (customer_id, payment_id, vehicle_id, request_type, price, buyer, seller) VALUES ('%s', '%s', %d, '%s', %d, '%s', '%s')",
      $customer_id,
      $payment_id,
      $vehicle_id,
      $request_type,
      $price,
      $buyer,
      $seller
    ));
  }

  // Returns a list of the purchase requests a user has made
  public function listRequestsBuyer($buyer) {
    return $this->select(sprintf("SELECT vehicle_id, request_type, time_posted, status, price, buyer, seller FROM requests WHERE buyer='%s'", $buyer));
  }

  // Returns a list of the purchase requests for a user's vehicles
  public function listRequestsSeller($seller) {
    return $this->select(sprintf("SELECT vehicle_id, request_type, time_posted, status, price, buyer, seller FROM requests WHERE seller='%s'", $seller));
  }

  // Returns a specific requests information
  public function getRequest($vehicle_id, $buyer, $seller) {
    return $this->select(sprintf("SELECT * FROM requests WHERE vehicle_id=%d AND buyer='%s' AND seller='%s'", $vehicle_id, $buyer, $seller));
  }

  // Accepts a purchase request
  public function acceptRequest($vehicle_id, $buyer, $seller) {
    $this->insert(sprintf("UPDATE requests SET status='%s' WHERE vehicle_id=%d AND buyer='%s'", "Approved", $vehicle_id, $buyer));
    
    $accBuyer = $this->select(sprintf("SELECT email FROM accounts WHERE user='%s'", $buyer));
    $emailBuyer = $accBuyer[0]['email'];
    $accSeller = $this->select(sprintf("SELECT email FROM accounts WHERE user='%s'", $seller));
    $emailSeller = $accSeller[0]['email'];
    
    // Email to buyer
    $mail1 = new PHPMailer(true);
    $mail1->isSMTP();
    $mail1->SMTPDebug = 0;
    $mail1->Host = 'smtp.gmail.com';
    $mail1->SMTPAuth = true;
    $mail1->Username = 'kmetcalfe4@gmail.com';
    $mail1->Password = 'olvewbmwkqzeedsy';
    $mail1->SMTPSecure = 'tls';
    $mail1->setFrom('noreply@joyride.kianm.net', 'Joyride');
    $mail1->addAddress($emailBuyer);
    $mail1->Subject = 'Contact your seller!';
    $mail1->isHTML(true);
    $mail1->Body = '<p>Get in contact with <a href="mailto:' . $emailSeller . '">' . $emailSeller . '</a> to complete your purchase!</p>';
    $mail1->Port = 587;
    try {
      $mail1->send();
    } catch (Exception $e) {
      return "Mailer Error: " . $mail1->ErrorInfo . "\n";
    }

    // Email to seller
    $mail2 = new PHPMailer(true);
    $mail2->isSMTP();
    $mail2->SMTPDebug = 0;
    $mail2->Host = 'smtp.gmail.com';
    $mail2->SMTPAuth = true;
    $mail2->Username = 'kmetcalfe4@gmail.com';
    $mail2->Password = 'olvewbmwkqzeedsy';
    $mail2->SMTPSecure = 'tls';
    $mail2->setFrom('noreply@joyride.kianm.net', 'Joyride');
    $mail2->addAddress($emailSeller);
    $mail2->Subject = 'Contact your buyer!';
    $mail2->isHTML(true);
    $mail2->Body = '<p>Get in contact with <a href="mailto:' . $emailBuyer . '">' . $emailBuyer . '</a> to fulfill their request!</p>';
    $mail2->Port = 587;
    try {
      $mail2->send();
    } catch (Exception $e) {
      return "Mailer Error: " . $mail2->ErrorInfo . "\n";
    }

    return $this->select(sprintf("SELECT * FROM requests WHERE vehicle_id=%d AND buyer='%s'", $vehicle_id, $buyer));
  }

  // Cancels a purchase request for a vehicle
  public function cancelRequest($vehicle_id, $buyer) {
    return $this->insert(sprintf("DELETE FROM requests WHERE vehicle_id=%d AND buyer='%s'", $vehicle_id, $buyer));
  }
}
