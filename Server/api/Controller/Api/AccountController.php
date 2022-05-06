<?php
require '/joyride/api/Model/AccountModel.php';
// Controls requests sent to the /account endpoint
class AccountController extends BaseController {
  /**
   * "/account/favorites" Endpoint - Returns a json array of a user's favorite vehicles
   */
  public function favoritesAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    // GET request handling
    if (strtoupper($requestMethod) == 'GET') {
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

            $vehicles = $accountModel->getFavorites($user);

            $responseData = json_encode($vehicles);
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
   * "/account/removeFav" Endpoint - Removes a vehicle from a user's favorites 
   */
  public function removeFavoriteAction() {
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
            $id = $body->{'id'};

            $accountModel->removeFavorite($user, $id);

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

  /**
   * "/account/addFav" Endpoint - Adds a vehicle to a user's favorites 
   */
  public function addFavoriteAction() {
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
            $id = $body->{'id'};

            $accountModel->addFavorite($user, $id);

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
   * "/account/ratings" Endpoint - Returns a json array of a user's ratings
   */
  public function ratingsAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    // GET request handling
    if (strtoupper($requestMethod) == 'GET') {
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
            $ratings = $accountModel->getRatings($user);

            $responseData = json_encode($ratings);
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
