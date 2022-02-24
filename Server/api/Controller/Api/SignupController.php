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
 
        if (strtoupper($requestMethod) == 'POST') {
            if (isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])) {
                $user = $_SERVER['PHP_AUTH_USER'];
                $pswd = $_SERVER['PHP_AUTH_PW'];

                $body = file_get_contents('php://input');
                $email = json_encode($body)['email'];

                try {
                    $accountModel = new AccountModel();

                    $pass = password_hash($pswd, PASSWORD_BCRYPT);
                    $accArr = $accountModel->addAccount($email, $user, $pass);

                    $responseData = json_encode('{"signedUp": true}');
                } catch (Error $e) {
                    $strErrorDesc = $e->getMessage().'Something went wrong! Please contact support.';
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
            $this->sendOutput(json_encode(array('error' => $strErrorDesc)), 
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }
}