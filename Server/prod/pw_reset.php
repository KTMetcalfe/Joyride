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

            $userNew = $pswdNew = $pswdNew2 = $pswdNew0 =  "";
            $userErrS = $pswdErrS = $pswdErrS2 = $pswdErrS0 = $submitErrS = "";

            if (empty($_POST["user"])) {
                $userErrS = "No username entered";
            } else {
                $userNew = $_POST["user"];
            }
            
            if (empty($_POST["pswd0"])) {
                $pswdErrS0 = "No password entered";
            } else {
                $pswdNew0 = $_POST["pswd0"];
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
                    $sql = sprintf("SELECT * FROM accounts WHERE user = '%s';", $userNew);
                    $result = mysqli_query($conn, $sql);

                    if (mysqli_num_rows($result) == 1) {
                        $row = mysqli_fetch_assoc($result);
                        if (password_verify($pswdNew0, $row["pass"])) {
                            $passNew = password_hash($pswdNew, PASSWORD_BCRYPT);

                            $sql = sprintf("UPDATE accounts SET pass = '%s' WHERE user = '%s' AND pass = '%s';", $passNew, $userNew, $row["pass"]);
                            if (mysqli_query($conn, $sql)) {
                                echo "Password changed";
                            }
                        }
                    }

                    mysqli_close($conn);
                } else {
                    die("Connection failed: " . mysqli_connect_error());
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
            <h2 id="hsu">Change Password</h2>
            <form method="post" autocomplete="off" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
                <input type="text" name="user" placeholder="Username">
                <br>
                <span id="error"><?php if (!empty($userErrS)) {echo "*", $userErrS;}?></span>
                <br><br>
                <input type="password" name="pswd0" placeholder="Old password">
                <br>
                <span id="error"><?php if (!empty($pswdErrS0)) {echo "*", $pswdErrS;}?></span>
                <br>
                <input type="password" name="pswd" placeholder="New password">
                <br>
                <span id="error"><?php if (!empty($pswdErrS)) {echo "*", $pswdErrS;}?></span>
                <br>
                <input type="password" name="pswd2" placeholder="Confirm new password">
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
