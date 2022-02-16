<html>
    <?php
    include("../prodBack/nav_user.php");

    $servername = "10.0.0.10";
    $username = "clouduser";
    $password = "RoadsteR07DB";
    $database = "appDB";

    session_start();

    if ($_SESSION["user"] == null || $_SESSION["pass"] == null) {
        header("Location: login");
        exit;
    }

    $user = $_SESSION["user"];
    $pass = $_SESSION["pass"];

    $conn = mysqli_connect($servername, $username, $password, $database);
    if ($conn) {
        $sql = sprintf("SELECT * FROM accounts WHERE user = '%s' AND pass = '%s'", $user, $pass);
        $result = mysqli_query($conn, $sql);

        if (mysqli_num_rows($result) == 1) {          
            $row = mysqli_fetch_assoc($result);

            if ($row["admin"] == "YES") {
                include("../prodBack/nav_admin.php");
            }

            if (!empty($row["home"])) {
                echo $row["home"];
            }
        } else {
            http_response_code(401);
            header("Location: login");
            exit;
        }
    }
    ?>
</html>
