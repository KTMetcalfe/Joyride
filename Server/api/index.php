<?php
require "./inc/bootstrap.php";

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  return 0;
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

if (isset($uri[2]) && $uri[2] == 'login') {
  require "./Controller/Api/LoginController.php";

  $objFeedController = new LoginController();
  $strMethodName = $uri[3] . 'Action';
  $objFeedController->{$strMethodName}();
} else if (isset($uri[2]) && $uri[2] == 'signup') {
  require "./Controller/Api/SignupController.php";

  $objFeedController = new SignupController();
  $strMethodName = isset($uri[3]) ? $uri[3] . "Action" : 'signupAction';
  $objFeedController->{$strMethodName}();
} else if (isset($uri[2]) && $uri[2] == 'vehicles') {
  require "./Controller/Api/VehiclesController.php";

  $objFeedController = new VehiclesController();
  $strMethodName = $uri[3] . 'Action';
  $objFeedController->{$strMethodName}();
} else if (isset($uri[2]) && $uri[2] == 'account') {
  require "./Controller/Api/AccountController.php";

  $objFeedController = new AccountController();
  $strMethodName = $uri[3] . 'Action';
  $objFeedController->{$strMethodName}();
} else if (isset($uri[2]) && $uri[2] == 'comments') {
  require "./Controller/Api/CommentsController.php";

  $objFeedController = new CommentsController();
  $strMethodName = $uri[3] . 'Action';
  $objFeedController->{$strMethodName}();
} else if (isset($uri[2]) && $uri[2] == 'payment') {
  require "./Controller/Api/PaymentController.php";

  $objFeedController = new PaymentController();
  $strMethodName = $uri[3] . 'Action';
  $objFeedController->{$strMethodName}();
} else {
  header("HTTP/1.1 404 Not Found");
  exit();
}
