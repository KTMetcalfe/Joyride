<?php
require '/joyride/api/Model/VehicleModel.php';
class VehiclesController extends BaseController
{
    /**
     * "/vehicles/list" Endpoint - Gets a token from a user
     */
    public function listAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            if (
                isset($arrQueryStringParams['admin']) && $arrQueryStringParams['admin']
                && isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])
            ) {
                $user = $_SERVER['PHP_AUTH_USER'];
                $pswd = $_SERVER['PHP_AUTH_PW'];

                try {
                    require '/joyride/api/Model/AccountModel.php';
                    $accountModel = new AccountModel();
                    $accArr = $accountModel->getAccount($user);

                    if (count($accArr) == 1 && password_verify($pswd, $accArr[0]['pass']) && $accArr[0]['priveledge'] >= 2) {
                        $vehicleModel = new VehicleModel();
                        $vehicles = $vehicleModel->listVehiclesAdmin();

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
                try {
                    $vehicleModel = new VehicleModel();

                    $vehicles = $vehicleModel->listVehicles();

                    $responseData = json_encode($vehicles);
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
