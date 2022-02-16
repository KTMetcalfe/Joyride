<html>
    <?php
    $servername = "10.0.0.10";
    $username = "clouduser";
    $password = "RoadsteR07DB";
    $database = "appDB";

    session_start();

    $_SESSION["user"] = $_SESSION["pass"] = null;

    $user = $pswd = "";
    $userErrL = $pswdErrL = $submitErrL = "";

    if (empty($_POST["user"])) {
        $userErrL = "No username entered";
    } else {
        $user = $_POST["user"];
    }
        
    if (empty($_POST["pswd"])) {
        $pswdErrL = "No password entered";
    } else {
        $pswd = $_POST["pswd"];
    }
        
    if (!empty($user) && !empty($pswd)) {
        $conn = new mysqli($servername, $username, $password, $database);
        if ($conn) {
            $sql = sprintf("SELECT pass FROM accounts WHERE user = '%s';", $user);
            $result = mysqli_query($conn, $sql);

            if (mysqli_num_rows($result) == 1) {
                $row = mysqli_fetch_assoc($result);
                $pass = $row["pass"];

                if (password_verify($pswd, $pass)) {
                    $_SESSION["user"] = $user;
                    $_SESSION["pass"] = $pass;

                    header("Location: post_login.php");
                    exit;
                }
            } else {
                $userErrL = "User does not exist";
            }
        
            mysqli_close($conn);
        } else {
            die("Connection failed: " . mysqli_connect_error());
        }
    }
    ?>
    <head>
        <link rel="stylesheet" href="style.css" type="text/css">
    </head>
    <body>
        <div class="form">
            <img class="banner" src="banner.jpg" alt="login banner" width="250" height="75">
            <h2>Log In</h2>
            <form method="post" autocomplete="off" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
                <input type="text" name="user" placeholder="Username" value="<?php echo isset($user)?$user:'';?>">
                <br>
                <span id="error"><?php if (!empty($userErrL)) {echo "*", $userErrL;}?></span>
                <br>
                <input type="password" name="pswd" placeholder="Password">
                <br>
                <span id="error"><?php if (!empty($pswdErrL)) {echo "*", $pswdErrL;}?></span>
                <br>
                <input type="submit" name="login" class="submit">
                <br>
                <span id="error"><?php if (!empty($submitErrL)) {echo "*", $submitErrL;}?></span>
            </form>
            <!-- <a href="signup">Create Account</a> -->
        </div>
    </body>
</html>
