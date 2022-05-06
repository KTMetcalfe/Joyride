<?php
// Base class for all endpoint controllers
class BaseController {
  public function __call($name, $arguments) {
    $this->sendOutput('', array('HTTP/1.1 404 Not Found'));
  }

  // Parses URI segments from URL
  protected function getUriSegments() {
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = explode('/', $uri);

    return $uri;
  }

  // Parses QueryString Parameters from URL
  protected function getQueryStringParams() {
    parse_str($_SERVER['QUERY_STRING'], $query);

    return $query;
  }

  // Returns output with proper headers
  protected function sendOutput($data, $httpHeaders = array()) {
    header_remove('Set-Cookie');

    if (is_array($httpHeaders) && count($httpHeaders)) {
      foreach ($httpHeaders as $httpHeader) {
        header($httpHeader);
      }
    }

    echo $data;
    exit;
  }
}
