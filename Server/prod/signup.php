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

            $userNew = $pswdNew = $pswdNew2 = "";
            $userErrS = $pswdErrS = $pswdErrS2 = $submitErrS = "";

            if (empty($_POST["user"])) {
                $userErrS = "No username entered";
            } else {
                $userNew = $_POST["user"];
            }
                
            if (empty($_POST["pswd"])) {
                $pswdErrS = "No password entered";
            } else if (empty($_POST["pswd2"])) {
                $pswdErrS2 = "No password entered";
            } else {
                $pswdNew = $_POST["pswd"];
                $pswdNew2 = $_POST["pswd2"];
            }

            if (!empty($userNew) && !empty($pswdNew) && !empty($pswdNew2)) {
                if ($pswdNew == $pswdNew2) {
                    $sql = sprintf("SELECT user FROM accounts WHERE user = '%s';", $userNew);
                    $result = mysqli_query($conn, $sql);

                    if (mysqli_num_rows($result) == 0) {
                        $passNew = password_hash($pswdNew, PASSWORD_BCRYPT);

                        $sql = sprintf("INSERT INTO accounts (user, pass) VALUES ('%s', '%s');", $userNew, $passNew);
                        if (mysqli_query($conn, $sql)) {
                            echo "Account created";
                        }
                    } else {
                        $userErrS = "Username taken";
                    }

                    mysqli_close($conn);
                } else {
                    $pswdErrS2 = "Password does not match";
                }
            }
        } else {
            http_response_code(401);
            header("Location: login");
            exit;
        }
    }
    ?>
    <body>
        <div class="form">
            <h2 id="hsu">Create Account</h2>
            <form method="post" autocomplete="off" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
                <input type="text" name="user" placeholder="Username">
                <br>
                <span id="error"><?php if (!empty($userErrS)) {echo "*", $userErrS;}?></span>
                <br><br>
                <input type="password" name="pswd" placeholder="Password">
                <br>
                <span id="error"><?php if (!empty($pswdErrS)) {echo "*", $pswdErrS;}?></span>
                <br>
                <input type="password" name="pswd2" placeholder="Confirm password">
                <br>
                <span id="error"><?php if (!empty($pswdErrS2)) {echo "*", $pswdErrS2;}?></span>
                <br>
                <input type="submit" name="signup" class="submit">
                <br>
                <span id="error"><?php if (!empty($submitErrS)) {echo "*", $submitErrS;}?></span>
            </form>
        </div>
    </body>
</html>
