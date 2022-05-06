<?php
// Main database functions
class Database {
  protected $connection = null;

  // Main constructor for all database calls, establishes connection
  public function __construct() {
    try {
      $this->connection = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE_NAME);

      if (mysqli_connect_errno()) {
        throw new Exception("Could not connect to database.");
      }
    } catch (Exception $e) {
      throw new Exception($e->getMessage());
    }
  }

  // Basic select statement handling for SQL database
  public function select($query = "", $params = []) {
    try {
      $statement = $this->executeStatement($query, $params);
      $result = $statement->get_result()->fetch_all(MYSQLI_ASSOC);
      $statement->close();

      return $result;
    } catch (Exception $e) {
      throw new Exception($e->getMessage());
    }
    return false;
  }

  // Basic insert statement handling for SQL database
  public function insert($query = "", $params = []) {
    try {
      $statement = $this->executeStatement($query, $params);
      $statement->close();
    } catch (mysqli_sql_exception $e) {
      throw new mysqli_sql_exception($e->getMessage(), $e->getCode());
    } catch (Exception $e) {
      throw new Exception($e->getMessage());
    }
  }

  // Simplified execute statement
  private function executeStatement($query = "", $params = []) {
    try {
      $statement = $this->connection->prepare($query);

      if ($statement === false) {
        throw new Exception("Unable to do prepared statement: " . $query);
      }

      if ($params) {
        $statement->bind_param($params[0], $params[1]);
      }

      $statement->execute();

      return $statement;
    } catch (mysqli_sql_exception $e) {
      throw new mysqli_sql_exception($e->getMessage(), $e->getCode());
    } catch (Exception $e) {
      throw new Exception($e->getMessage());
    }
  }
}
