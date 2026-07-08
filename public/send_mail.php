<?php
header("Access-Control-Allow-Origin: https://jensbaumann.com");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

$name = str_replace(["\r", "\n"], "", $data["name"] ?? "");
$email = $data["email"] ?? "";
$message = $data["message"] ?? "";
$privacy = $data["privacy"] ?? false;

if (empty($name) || empty($email) || empty($message) || !$privacy) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid email format"]);
    exit;
}

$recipient = "info@jensbaumann.com";
$subject = "Neue Kontaktanfrage (Portfolio) von $name";

$email_content = "Name: $name\n";
$email_content .= "E-Mail: $email\n\n";
$email_content .= "Nachricht:\n$message\n";

$headers = "From: noreply@jensbaumann.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($recipient, $subject, $email_content, $headers)) {
    http_response_code(200);
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to send email"]);
}
