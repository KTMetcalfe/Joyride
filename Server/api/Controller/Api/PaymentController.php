<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once dirname(__FILE__).'/../../../stripe-php/init.php';

\Stripe\Stripe::setApiKey('sk_test_51KrBMoHW1ixNikIwKQlW4FR4teRYa5BiLbcE3eIz6m8IkrgMczPc3kbVA5jRIHZNhSfF2E2mc1yitcfqXnWXYm4y00UvZ0Qvn7');

class PaymentController extends BaseController {
  public function buyAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    if (strtoupper($requestMethod) == 'POST') {
      try {
        $data = file_get_contents('php://input');
        $body = json_decode($data);
        $price = $body->{'cents'};

        $paymentIntent = \Stripe\PaymentIntent::create([
          'amount' => $price,
          'currency' => 'usd',
          'automatic_payment_methods' => [
            'enabled' => true
          ]
        ]);

        $responseData = '{"clientSecret":"' . $paymentIntent->client_secret . '"}';
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

  public function rentAction() {
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

  public function subscribeAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    try {
      $stripe = new \Stripe\StripeClient('sk_test_51KrBMoHW1ixNikIwKQlW4FR4teRYa5BiLbcE3eIz6m8IkrgMczPc3kbVA5jRIHZNhSfF2E2mc1yitcfqXnWXYm4y00UvZ0Qvn7');

      $data = file_get_contents('php://input');
      $body = json_decode($data);
      $price = $body->{'cents'};
      $customer_id = $body->{'customer_id'};
      $payment_id = $body->{'payment_id'};

      $paymentIntent = \Stripe\PaymentIntent::create([
        'amount' => $price,
        'currency' => 'usd',
        'customer' => $customer_id,
        'payment_method' => $payment_id,
        'off_session' => true,
        'confirm' => true,
      ]);

      $responseData = '{"clientSecret":"' . $paymentIntent->client_secret . '"}';
    } catch (\Stripe\Exception\CardException $e) {
      // Error code will be authentication_required if authentication is needed
      echo 'Error code is:' . $e->getError()->code;
      $payment_intent_id = $e->getError()->payment_intent->id;
      $payment_intent = \Stripe\PaymentIntent::retrieve($payment_intent_id);
    } catch (Error $e) {
      $strErrorDesc = $e->getMessage() . 'Something went wrong! Please contact support.';
      $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
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
