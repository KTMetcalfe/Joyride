<?php
require_once "/joyride/api/Model/Database.php";

class PaymentModel extends Database {
  // Reads and removes a comment from a matching vehicle
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

  public function listRequestsBuyer($buyer) {
    return $this->select(sprintf("SELECT vehicle_id, request_type, time_posted, status, price, buyer, seller FROM requests WHERE buyer='%s'", $buyer));
  }

  public function listRequestsSeller($seller) {
    return $this->select(sprintf("SELECT vehicle_id, request_type, time_posted, status, price, buyer, seller FROM requests WHERE seller='%s'", $seller));
  }

  // Returns a list of comment replies from matching comment id
  public function getRequest($vehicle_id, $buyer, $seller) {
    return $this->select(sprintf("SELECT * FROM requests WHERE vehicle_id=%d AND buyer='%s' AND seller='%s'", $vehicle_id, $buyer, $seller));
  }

  // Returns a list of comment replies from matching comment id
  public function acceptRequest($vehicle_id, $buyer) {
    $this->insert(sprintf("UPDATE requests SET status='%s' WHERE vehicle_id=%d AND buyer='%s'", "Approved", $vehicle_id, $buyer));
    return $this->select(sprintf("SELECT * FROM requests WHERE vehicle_id=%d AND buyer='%s'", $vehicle_id, $buyer));
  }

  // Returns a list of comment replies from matching comment id
  public function cancelRequest($vehicle_id, $buyer) {
    return $this->insert(sprintf("DELETE FROM requests WHERE vehicle_id=%d AND buyer='%s'", $vehicle_id, $buyer));
  }
}
