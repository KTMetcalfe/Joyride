<?php
use PHPMailer\PHPMailer\PHPMailer;

require '/joyride/api/PHPMailer/src/Exception.php';
require '/joyride/api/PHPMailer/src/PHPMailer.php';
require '/joyride/api/PHPMailer/src/SMTP.php';

$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->SMTPDebug = 1;
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'kmetcalfe4@gmail.com';
$mail->Password = 'olvewbmwkqzeedsy';
$mail->SMTPSecure = 'tls';
$mail->setFrom('noreply@joyride.kianm.net', 'Joyride');
$mail->addAddress('redtek720@gmail.com');
$mail->Subject = 'Hello world!';
$mail->Body = 'Test!';
$mail->Port = 587;

try {
    $mail->send();
    echo "Message has been sent successfully\n";
} catch (Exception $e) {
    echo "Mailer Error: " . $mail->ErrorInfo . "\n";
}
?>