<?php
require "/joyride/api/inc/bootstrap.php";
 
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode( '/', $uri );
 
if ((isset($uri[2]) && $uri[2] != 'login') || !isset($uri[3])) {
    header("HTTP/1.1 404 Not Found");
    exit();
}
 
require "/joyride/api/Controller/Api/LoginController.php";
 
$objFeedController = new LoginController();
$strMethodName = $uri[3] . 'Action';
$objFeedController->{$strMethodName}();
?>