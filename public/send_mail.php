<?php
header("Access-Control-Allow-Origin: https://jensbaumann.com");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

const MIN_FILL_TIME_MS = 3000;
const MAX_MESSAGE_LENGTH = 5000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 3600;

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

if (!empty($data["website"]) || (int) ($data["elapsed"] ?? 0) < MIN_FILL_TIME_MS) {
    http_response_code(200);
    echo json_encode(["success" => true]);
    exit;
}

if (!allow_request()) {
    http_response_code(429);
    echo json_encode(["error" => "Too many requests"]);
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

if (mb_strlen($message) > MAX_MESSAGE_LENGTH) {
    http_response_code(400);
    echo json_encode(["error" => "Message too long"]);
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

function allow_request(): bool
{
    $store = sys_get_temp_dir() . "/portfolio_contact_rate.json";
    $client = hash("sha256", ($_SERVER["REMOTE_ADDR"] ?? "unknown") . "portfolio-contact");
    $now = time();

    $handle = fopen($store, "c+");
    if ($handle === false) {
        return true;
    }

    flock($handle, LOCK_EX);

    $raw = stream_get_contents($handle);
    $entries = json_decode($raw ?: "[]", true);
    if (!is_array($entries)) {
        $entries = [];
    }

    foreach ($entries as $key => $timestamps) {
        $entries[$key] = array_values(array_filter($timestamps, fn($t) => $now - $t < RATE_LIMIT_WINDOW));
        if (empty($entries[$key])) {
            unset($entries[$key]);
        }
    }

    $allowed = count($entries[$client] ?? []) < RATE_LIMIT_MAX;

    if ($allowed) {
        $entries[$client][] = $now;
    }

    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($entries));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    return $allowed;
}
