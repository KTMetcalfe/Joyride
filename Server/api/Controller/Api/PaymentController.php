<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once dirname(__FILE__) . '/../../../stripe-php/init.php';

require '/joyride/api/Model/AccountModel.php';
require '/joyride/api/Model/VehicleModel.php';
require '/joyride/api/Model/PaymentModel.php';

\Stripe\Stripe::setApiKey('sk_test_51KrBMoHW1ixNikIwKQlW4FR4teRYa5BiLbcE3eIz6m8IkrgMczPc3kbVA5jRIHZNhSfF2E2mc1yitcfqXnWXYm4y00UvZ0Qvn7');

// Controls requests sent to the /payment endpoint
class PaymentController extends BaseController {
  /**
   * "/payment/listBuyer" Endpoint - Returns a json array of a user's purchase request
   */
  public function listBuyerAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();
    // POST request handling
    if (strtoupper($requestMethod) == 'GET') {
      if (isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])) {
        $user = $_SERVER['PHP_AUTH_USER'];
        $pswd = $_SERVER['PHP_AUTH_PW'];
        try {
          // Authorization check
          $accountModel = new AccountModel();
          $accArr = $accountModel->getAccount($user);

          if (count($accArr) == 1 && password_verify($pswd, $accArr[0]['pass'])) {
            // Main request logic

            $paymentModel = new PaymentModel;
            $result = $paymentModel->listRequestsBuyer($user);

            $responseData = json_encode($result);
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
   * "/payment/listSeller" Endpoint - Returns a json array of purchase requests for a user's vehicle
   */
  public function listSellerAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();
    // POST request handling
    if (strtoupper($requestMethod) == 'GET') {
      if (isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])) {
        $user = $_SERVER['PHP_AUTH_USER'];
        $pswd = $_SERVER['PHP_AUTH_PW'];
        try {
          // Authorization check
          $accountModel = new AccountModel();
          $accArr = $accountModel->getAccount($user);

          if (count($accArr) == 1 && password_verify($pswd, $accArr[0]['pass'])) {
            // Main request logic

            $paymentModel = new PaymentModel;
            $result = $paymentModel->listRequestsSeller($user);

            $responseData = json_encode($result);
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
   * "/payment/buyIntent" Endpoint - Follows same logic as a rent intent
   */
  public function buyIntentAction() {
    $this->rentIntentAction();
  }

  /**
   * "/payment/rentIntent" Endpoint - Returns Stripe client secret to confirm success
   */
  public function rentIntentAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    if (strtoupper($requestMethod) == 'POST') {
      try {
        $data = file_get_contents('php://input');
        $body = json_decode($data);
        $buyer = $body->{'buyer'};

        $stripe = new \Stripe\StripeClient('sk_test_51KrBMoHW1ixNikIwKQlW4FR4teRYa5BiLbcE3eIz6m8IkrgMczPc3kbVA5jRIHZNhSfF2E2mc1yitcfqXnWXYm4y00UvZ0Qvn7');
        $customer = \Stripe\Customer::create(
          [
            "name" => $buyer
          ]
        );
        $intent = $stripe->setupIntents->create(
          [
            'customer' => $customer->id,
            'payment_method_types' => ['card'],
          ]
        );

        $responseData = '{"clientSecret":"' . $intent->client_secret . '","customer_id":"' . $customer->id . '"}';
      } catch (Error $e) {
        $strErrorDesc = $e->getMessage() . 'Something went wrong! Please contact support.';
        $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
      }
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
   * "/payment/request" Endpoint - Creates a purchase request for a vehicle
   * Returns json boolean "requested"
   */
  public function requestAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();
    // POST request handling
    if (strtoupper($requestMethod) == 'POST') {
      if (isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])) {
        $user = $_SERVER['PHP_AUTH_USER'];
        $pswd = $_SERVER['PHP_AUTH_PW'];
        try {
          // Authorization check
          $accountModel = new AccountModel();
          $accArr = $accountModel->getAccount($user);

          if (count($accArr) == 1 && password_verify($pswd, $accArr[0]['pass'])) {
            // Main request logic

            $stripe = new \Stripe\StripeClient('sk_test_51KrBMoHW1ixNikIwKQlW4FR4teRYa5BiLbcE3eIz6m8IkrgMczPc3kbVA5jRIHZNhSfF2E2mc1yitcfqXnWXYm4y00UvZ0Qvn7');

            $data = file_get_contents('php://input');
            $body = json_decode($data);
            $customer_id = $body->{'customer_id'};
            $payment_id = $body->{'payment_id'};
            $vehicle_id = $body->{'vehicle_id'};
            $request_type = $body->{'request_type'};
            $price = $body->{'price'};
            $seller = $body->{'seller'};

            $paymentModel = new PaymentModel;
            $result = $paymentModel->createRequest($customer_id, $payment_id, $vehicle_id, $request_type, $price, $user, $seller);

            $responseData = '{"requested":true}';
          } else {
            $strErrorDesc = 'Not Authorized';
            $strErrorHeader = 'HTTP/1.1 401 Unauthorized';
          }
        } catch (Error $e) {
          $strErrorDesc = $e->getMessage() . 'Something went wrong! Please contact support.';
          $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
        }
      } else {
        $strErrorDesc = 'Method not supported';
        $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
      }
    } else {
      $strErrorDesc = 'Not Authorized';
      $strErrorHeader = 'HTTP/1.1 401 Unauthorized';
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
   * "/payment/accept" Endpoint - Accepts a purchase request for a vehicle
   * Returns json boolean "accepted"
   */
  public function acceptAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    // POST request handling
    if (strtoupper($requestMethod) == 'POST') {
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
            $buyer = $body->{'buyer'};

            $vehicleModel = new VehicleModel();
            $vehicles = $vehicleModel->getVehicle($vehicle_id);

            // Matching vehicle seller for approval
            if ($vehicles[0]['user'] == $user) {
              $stripe = new \Stripe\StripeClient('sk_test_51KrBMoHW1ixNikIwKQlW4FR4teRYa5BiLbcE3eIz6m8IkrgMczPc3kbVA5jRIHZNhSfF2E2mc1yitcfqXnWXYm4y00UvZ0Qvn7');

              $paymentModel = new PaymentModel;
              $request = $paymentModel->acceptRequest($vehicle_id, $buyer, $user);

              $customer_id = $request[0]['customer_id'];
              $payment_id = $request[0]['payment_id'];
              $price = $request[0]['price'];

              $paymentIntent = \Stripe\PaymentIntent::create([
                'amount' => $price,
                'currency' => 'usd',
                'customer' => $customer_id,
                'payment_method' => $payment_id,
                'off_session' => true,
                'confirm' => true,
                'description' => sprintf("%s %d: %s -> %s", $request[0]['request_type'], $vehicle_id, $user, $buyer)
              ]);

              $responseData = '{"accepted":true}';
            } else {
              $strErrorDesc = 'Not Authorized';
              $strErrorHeader = 'HTTP/1.1 401 Unauthorized';
            }
          } else if (count($accArr) > 1) {
            throw new Exception('Too many accounts');
          } else {
            $responseData = '{"isVerified": false}';
          }
        } catch (\Stripe\Exception\CardException $e) {
          // Error code will be authentication_required if authentication is needed
          echo 'Error code is:' . $e->getError()->code;
          $payment_intent_id = $e->getError()->payment_intent->id;
          $payment_intent = \Stripe\PaymentIntent::retrieve($payment_intent_id);
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
   * "/payment/cancel" Endpoint - Cancels a purchase request for a vehicle
   * Returns json boolean "cancelled"
   */
  public function cancelAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    // POST request handling
    if (strtoupper($requestMethod) == 'POST') {
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
            $buyer = $body->{'buyer'};
            $seller = $body->{'seller'};

            $paymentModel = new PaymentModel;
            $requests = $paymentModel->getRequest($vehicle_id, $buyer, $seller);

            // Matching vehicle seller or buyer for approval
            if ($requests[0]['buyer'] == $user || $requests[0]['seller'] == $user) {
              $response = $paymentModel->cancelRequest($vehicle_id, $buyer);

              $responseData = '{"cancelled":true}';
            } else {
              $strErrorDesc = 'Not Authorized';
              $strErrorHeader = 'HTTP/1.1 401 Unauthorized';
            }
          } else if (count($accArr) > 1) {
            throw new Exception('Too many accounts');
          } else {
            $responseData = '{"isVerified": false}';
          }
        } catch (\Stripe\Exception\CardException $e) {
          // Error code will be authentication_required if authentication is needed
          echo 'Error code is:' . $e->getError()->code;
          $payment_intent_id = $e->getError()->payment_intent->id;
          $payment_intent = \Stripe\PaymentIntent::retrieve($payment_intent_id);
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
