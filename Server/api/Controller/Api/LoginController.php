<?php
require '/joyride/api/Model/AccountModel.php';
class LoginController extends BaseController {
    /**
     * "/login/validate" Endpoint - Gets a token from a user
     */
    public function validateAction() {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();
 
        if (strtoupper($requestMethod) == 'POST') {
            if (isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])) {
                $user = $_SERVER['PHP_AUTH_USER'];
                $pswd = $_SERVER['PHP_AUTH_PW'];

                try {
                    $accountModel = new AccountModel();
    
                    $accArr = $accountModel->getAccount($user);

                    if (count($accArr) == 1 && password_verify($pswd, $accArr[0]['pass'])) {
                        $responseData = sprintf('{"isVerified": true, "email": "%s", "priveledge":%b}', $accArr[0]['email'], $accArr[0]['priveledge']);  
                    } else if (count($accArr) > 1) {
                        throw New Exception('Too many accounts');
                    } else {
                        $responseData = '{"isVerified": false}';
                    }
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