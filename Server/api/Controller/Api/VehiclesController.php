<?php
require '/joyride/api/Model/VehicleModel.php';
class VehiclesController extends BaseController {
  /**
   * "/vehicles/list" Endpoint - Gets a token from a user
   */
  public function listAction() {
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

            if (
              isset($arrQueryStringParams['offset']) && $arrQueryStringParams['offset']
              && isset($arrQueryStringParams['limit']) && $arrQueryStringParams['limit']
            ) {
              $offset = $arrQueryStringParams['offset'];
              $limit = $arrQueryStringParams['limit'];

              $vehicles = $vehicleModel->listVehiclesAdminLimited($offset, $limit);
              $responseData = json_encode($vehicles);
            } else {
              $vehicles = $vehicleModel->listVehiclesAdmin();
              $responseData = json_encode($vehicles);
            }
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

          if (
            isset($arrQueryStringParams['offset']) && isset($arrQueryStringParams['limit'])
          ) {
            $offset = $arrQueryStringParams['offset'];
            $limit = $arrQueryStringParams['limit'];

            $vehicles = $vehicleModel->listVehiclesLimited($offset, $limit);
            $responseData = json_encode($vehicles);
          } else {
            $vehicles = $vehicleModel->listVehicles();
            $responseData = json_encode($vehicles);
          }
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
    } else if (strtoupper($requestMethod) == 'POST') {
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
            $data = file_get_contents('php://input');
            $body = json_decode($data);

            if (isset($arrQueryStringParams['offset']) && $arrQueryStringParams['limit']) {
              $offset = $arrQueryStringParams['offset'];
              $limit = $arrQueryStringParams['limit'];
              $filter = $body;

              $vehicleModel = new VehicleModel();
              $vehicles = $vehicleModel->listVehiclesAdminFiltered($filter, $offset, $limit);
            } else {
              $ids = [];

              foreach ($body as $vehicle) {
                array_push($ids, $vehicle->id);
              }

              $vehicleModel = new VehicleModel();
              $vehicles = $vehicleModel->checkVehiclesAdmin($ids);
            }

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
          $data = file_get_contents('php://input');
          $body = json_decode($data);

          if (isset($arrQueryStringParams['offset']) && $arrQueryStringParams['limit']) {
            $offset = $arrQueryStringParams['offset'];
            $limit = $arrQueryStringParams['limit'];
            $filter = $body;

            $vehicleModel = new VehicleModel();
            $vehicles = $vehicleModel->listVehiclesFiltered($filter, $offset, $limit);
          } else {
            $ids = [];

            foreach ($body as $vehicle) {
              array_push($ids, $vehicle->id);
            }

            $vehicleModel = new VehicleModel();
            $vehicles = $vehicleModel->checkVehicles($ids);
          }

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

  /**
   * "/vehicles/add" Endpoint - Gets a token from a user
   */
  public function addAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    if (strtoupper($requestMethod) == 'POST') {
      if (isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])) {
        $user = $_SERVER['PHP_AUTH_USER'];
        $pswd = $_SERVER['PHP_AUTH_PW'];

        try {
          require '/joyride/api/Model/AccountModel.php';
          $accountModel = new AccountModel();
          $accArr = $accountModel->getAccount($user);

          if (count($accArr) == 1 && password_verify($pswd, $accArr[0]['pass'])) {
            $make = $_POST['make'];
            $model = $_POST['model'];
            $mileage = $_POST['mileage'];
            $price = $_POST['price'];
            $year = $_POST['year'];
            $capacity = $_POST['capacity'];

            $vehicleModel = new VehicleModel();
            $lastInsertedID = $vehicleModel->addVehicle($make, $model, $mileage, $price, $year, $capacity, $user);
            $id = $lastInsertedID[0]['LAST_INSERT_ID()'];

            $images = $_FILES;
            for ($i = 0; $i < count($_FILES); $i++) {
              move_uploaded_file($images['image-'.$i]['tmp_name'], './files/vehicle_images/'.$id.'-'.$i.'.jpg');
            }

            $responseData = '{"added":true,"id":'.$id.'}';
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
   * "/vehicles/approve" Endpoint - Gets a token from a user
   */
  public function approveAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    if (strtoupper($requestMethod) == 'POST') {
      if (isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])) {
        $user = $_SERVER['PHP_AUTH_USER'];
        $pswd = $_SERVER['PHP_AUTH_PW'];

        try {
          require '/joyride/api/Model/AccountModel.php';
          $accountModel = new AccountModel();
          $accArr = $accountModel->getAccount($user);

          if (count($accArr) == 1 && password_verify($pswd, $accArr[0]['pass']) && $accArr[0]['priveledge'] >= 2) {
            $data = file_get_contents('php://input');
            $body = json_decode($data);
            $id = $body->{'id'};

            $vehicleModel = new VehicleModel();
            $vehicleModel->approveVehicle($id);

            $responseData = '{"approved":true}';
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
   * "/vehicles/remove" Endpoint - Gets a token from a user
   */
  public function removeAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    if (strtoupper($requestMethod) == 'POST') {
      if (isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])) {
        $user = $_SERVER['PHP_AUTH_USER'];
        $pswd = $_SERVER['PHP_AUTH_PW'];

        try {
          require '/joyride/api/Model/AccountModel.php';
          $accountModel = new AccountModel();
          $accArr = $accountModel->getAccount($user);

          if (count($accArr) == 1 && password_verify($pswd, $accArr[0]['pass']) && $accArr[0]['priveledge'] >= 2) {
            $data = file_get_contents('php://input');
            $body = json_decode($data);
            $id = $body->{'id'};

            $vehicleModel = new VehicleModel();
            $vehicleModel->removeVehicle($id);

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
   * "/vehicles/get" Endpoint - Gets a token from a user
   */
  public function getAction() {
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    if (strtoupper($requestMethod) == 'POST') {
      if (isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])) {
        $user = $_SERVER['PHP_AUTH_USER'];
        $pswd = $_SERVER['PHP_AUTH_PW'];

        try {
          require '/joyride/api/Model/AccountModel.php';
          $accountModel = new AccountModel();
          $accArr = $accountModel->getAccount($user);

          if (count($accArr) == 1 && password_verify($pswd, $accArr[0]['pass'])) {
            $data = file_get_contents('php://input');
            $body = json_decode($data);
            $id = $body->{'id'};

            $vehicleModel = new VehicleModel();
            $vehicles = $vehicleModel->getVehicleAdmin($id);

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
            $data = file_get_contents('php://input');
            $body = json_decode($data);
            $id = $body->{'id'};

            $vehicleModel = new VehicleModel();
            $vehicles = $vehicleModel->getVehicle($id);

            $responseData = json_encode($vehicles);
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
