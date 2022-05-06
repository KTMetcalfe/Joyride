<?php
require_once "/joyride/api/Model/Database.php";

// Comments table query functions
class CommentsModel extends Database {
  // Returns a list of comments from matching vehicle id
  public function listComments($vehicle_id) {
    $comments = $this->select(sprintf("SELECT * FROM comments WHERE vehicle_id=%d", $vehicle_id));

    foreach ($comments as &$val) {
      if ($val['replied_to'] != null) {
        $index = array_search($val['replied_to'], array_column($comments, 'id'));
        $val['replied_to'] = $comments[$index];
      }
    }

    return $comments;
  }

  // Returns a list of comment replies from matching comment id
  public function listReplyComments($id) {
    return $this->select(sprintf("SELECT * FROM comments WHERE replied_to=%d", $id));
  }

  // Returns the information of a specific comment
  public function getComment($id) {
    return $this->select(sprintf("SELECT * FROM comments WHERE id=%d", $id));
  }

  // Reads and adds a comment on a matching vehicle
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

?>
