<?php
require '/joyride/api/Model/AccountModel.php';
require '/joyride/api/Model/CommentsModel.php';
// Controls requests sent to the /comments endpoint
class CommentsController extends BaseController {
  /**
   * "/comments/list" Endpoint - Returns a json array of comments on a vehicle
   */
  public function listAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    // POST request handling
    if (strtoupper($requestMethod) == 'POST') {
      try {
        $data = file_get_contents('php://input');
        $body = json_decode($data);
        $vehicle_id = $body->{'vehicle_id'};

        $commentsModel = new CommentsModel();
        $comments = $commentsModel->listComments($vehicle_id);

        $responseData = json_encode($comments);
      } catch (Error $e) {
        $strErrorDesc = $e->getMessage() . 'Something went wrong! Please contact support.';
        $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
      }
    } else {
      $strErrorDesc = 'Method not supported';
      $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
    }

    // send output
    if (!$strErrorDesc) {
      $this->sendOutput(
        $responseData,
        array('Content-Type: application/json', 'HTTP/1.1 200 OK')
      );
    } else {
      $this->sendOutput(
        json_encode(array('error' => $strErrorDesc)),
        array('Content-Type: application/json', $strErrorHeader)
      );
    }
  }

  /**
   * "/comments/listReplies" Endpoint - Returns a json array of replies to a comment
   */
  public function listRepliesAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    // POST request handling
    if (strtoupper($requestMethod) == 'POST') {
      try {
        $data = file_get_contents('php://input');
        $body = json_decode($data);
        $id = $body->{'id'};

        $commentsModel = new CommentsModel();
        $comments = $commentsModel->listReplyComments($id);

        $responseData = json_encode($comments);
      } catch (Error $e) {
        $strErrorDesc = $e->getMessage() . 'Something went wrong! Please contact support.';
        $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
      }
    } else {
      $strErrorDesc = 'Method not supported';
      $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
    }

    // send output
    if (!$strErrorDesc) {
      $this->sendOutput(
        $responseData,
        array('Content-Type: application/json', 'HTTP/1.1 200 OK')
      );
    } else {
      $this->sendOutput(
        json_encode(array('error' => $strErrorDesc)),
        array('Content-Type: application/json', $strErrorHeader)
      );
    }
  }

  /**
   * "/comments/get" Endpoint - Returns a specific comments information
   */
  public function getAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    // POST request handling
    if (strtoupper($requestMethod) == 'POST') {
      try {
        $data = file_get_contents('php://input');
        $body = json_decode($data);
        $id = $body->{'id'};

        $commentsModel = new CommentsModel();
        $comments = $commentsModel->getComment($id);

        $responseData = json_encode($comments);
      } catch (Error $e) {
        $strErrorDesc = $e->getMessage() . 'Something went wrong! Please contact support.';
        $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
      }
    } else {
      $strErrorDesc = 'Method not supported';
      $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
    }

    // send output
    if (!$strErrorDesc) {
      $this->sendOutput(
        $responseData,
        array('Content-Type: application/json', 'HTTP/1.1 200 OK')
      );
    } else {
      $this->sendOutput(
        json_encode(array('error' => $strErrorDesc)),
        array('Content-Type: application/json', $strErrorHeader)
      );
    }
  }

  /**
   * "/comments/add" Endpoint - Adds a comment to a vehicle
   * Returns json boolean "added"
   */
  public function addAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    // POST request handling
    if (strtoupper($requestMethod) == 'POST') {
      // Header check
      if (isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])) {
        $user = $_SERVER['PHP_AUTH_USER'];
        $pswd = $_SERVER['PHP_AUTH_PW'];

        try {
          // Authorization check
          $accountModel = new AccountModel();
          $accArr = $accountModel->getAccount($user);

          if (count($accArr) == 1 && password_verify($pswd, $accArr[0]['pass'])) {
            // Main request logic

            $data = file_get_contents('php://input');
            $body = json_decode($data);
            $vehicle_id = $body->{'vehicle_id'};
            $content = $body->{'content'};
            $replied_to = isset($body->{'replied_to'}) ? $body->{'replied_to'} : null;

            $commentsModel = new CommentsModel();
            $commentsModel->addComment($vehicle_id, $content, $user, $replied_to);

            $responseData = '{"added":true}';
          } else if (count($accArr) > 1) {
            throw new Exception('Too many accounts');
          } else {
            $strErrorDesc = 'Not Authorized';
            $strErrorHeader = 'HTTP/1.1 401 Unauthorized';
          }
        } catch (Error $e) {
          $strErrorDesc = $e->getMessage() . 'Something went wrong! Please contact support.';
          $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
        }
      } else {
        $strErrorDesc = 'Not Authorized';
        $strErrorHeader = 'HTTP/1.1 401 Unauthorized';
      }
    } else {
      $strErrorDesc = 'Method not supported';
      $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
    }

    // send output
    if (!$strErrorDesc) {
      $this->sendOutput(
        $responseData,
        array('Content-Type: application/json', 'HTTP/1.1 200 OK')
      );
    } else {
      $this->sendOutput(
        json_encode(array('error' => $strErrorDesc)),
        array('Content-Type: application/json', $strErrorHeader)
      );
    }
  }

  /**
   * "/comments/remove" Endpoint - Removes a comment from a vehicle
   * Returns json boolean "removed"
   */
  public function removeAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    // POST request handling
    if (strtoupper($requestMethod) == 'POST') {
      // Header check
      if (isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])) {
        $user = $_SERVER['PHP_AUTH_USER'];
        $pswd = $_SERVER['PHP_AUTH_PW'];

        try {
          // Authorization check
          $accountModel = new AccountModel();
          $accArr = $accountModel->getAccount($user);

          if (count($accArr) == 1 && password_verify($pswd, $accArr[0]['pass']) && $accArr[0]['priveledge'] >= 1) {
            // Main request logic

            $data = file_get_contents('php://input');
            $body = json_decode($data);
            $id = $body->{'id'};

            $commentsModel = new CommentsModel();
            $commentsModel->removeComment($id);

            $responseData = '{"removed":true}';
          } else if (count($accArr) > 1) {
            throw new Exception('Too many accounts');
          } else {
            $strErrorDesc = 'Not Authorized';
            $strErrorHeader = 'HTTP/1.1 401 Unauthorized';
          }
        } catch (Error $e) {
          $strErrorDesc = $e->getMessage() . 'Something went wrong! Please contact support.';
          $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
        }
      } else {
        $strErrorDesc = 'Not Authorized';
        $strErrorHeader = 'HTTP/1.1 401 Unauthorized';
      }
    } else {
      $strErrorDesc = 'Method not supported';
      $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
    }

    // send output
    if (!$strErrorDesc) {
      $this->sendOutput(
        $responseData,
        array('Content-Type: application/json', 'HTTP/1.1 200 OK')
      );
    } else {
      $this->sendOutput(
        json_encode(array('error' => $strErrorDesc)),
        array('Content-Type: application/json', $strErrorHeader)
      );
    }
  }
}
