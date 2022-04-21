<?php
require '/joyride/api/Model/AccountModel.php';
class SignupController extends BaseController {
  /**
   * "/signup" Endpoint - Gets a token from a user
   */
  public function signupAction() {
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
          // Main request logic

          $data = file_get_contents('php://input');
          $body = json_decode($data);
          $email = $body->{'email'};

          $accountModel = new AccountModel();

          $pass = password_hash($pswd, PASSWORD_BCRYPT);
          $result = $accountModel->addAccount($email, $user, $pass);

          $responseData = '{"signedUp":' . ($result ? "true" : "false") . '}';
        } catch (mysqli_sql_exception $e) {
          if ($e->getCode() === 1062) {
            $strErrorDesc = 'username_taken';
            $strErrorHeader = 'HTTP/1.1 400 Bad Request';
          } else {
            throw new mysqli_sql_exception($e->getMessage(), $e->getCode());
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
   * "/signup/verifyEmail" Endpoint - Gets a token from a user
   */
  public function verifyEmailAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    // POST request handling
    if (strtoupper($requestMethod) == 'GET') {
      // Header check
      try {
        // Main request logic

        $email = $arrQueryStringParams['email'];
        $verification_code = $arrQueryStringParams['code'];

        $accountModel = new AccountModel();

        $result = $accountModel->verifyAccount($email, $verification_code);

        $responseData = '{"verified":' . ($result ? "true" : "false") . '}';
      } catch (mysqli_sql_exception $e) {
        if ($e->getCode() === 1062) {
          $strErrorDesc = 'username_taken';
          $strErrorHeader = 'HTTP/1.1 400 Bad Request';
        } else {
          throw new mysqli_sql_exception($e->getMessage(), $e->getCode());
        }
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
}
