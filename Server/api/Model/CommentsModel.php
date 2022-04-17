<?php
require_once "/joyride/api/Model/Database.php";

class CommentsModel extends Database {
  // Returns a list of vehicle ids from matching accounts
  public function listComments($vehicle_id) {
    return $this->select(sprintf("SELECT * FROM comments WHERE vehicle_id=%d", $vehicle_id));
  }

  // Reads and adds to the current comment on a matching vehicle
  public function addComment($vehicle_id, $content, $user, $replied_to) {
    if (isset($replied_to)) {
      $this->insert(sprintf("INSERT INTO comments (vehicle_id, content, user, replied_to) VALUES (%d, '%s', '%s', %d)", $vehicle_id, $content, $user, $replied_to));
    } else {
      $this->insert(sprintf("INSERT INTO comments (vehicle_id, content, user) VALUES (%d, '%s', '%s')", $vehicle_id, $content, $user));
    }
    return;
  }

  // Reads and removes a comment from a matching vehicle
  public function removeComment($id) {
    $this->insert(sprintf("DELETE FROM comments WHERE id=%d", $id));
    return;
  }
}
