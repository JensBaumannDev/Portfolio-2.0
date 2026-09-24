<?php
header("Content-Type: application/json");

const MIN_FILL_TIME_MS = 3000;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 3600;

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

if (!empty($data["website"]) || !is_numeric($data["elapsed"] ?? null) || $data["elapsed"] < MIN_FILL_TIME_MS) {
    http_response_code(200);
    echo json_encode(["success" => true]);
    exit;
}

$name = $data["name"] ?? null;
$email = $data["email"] ?? "";
$message = $data["message"] ?? "";
$privacy = $data["privacy"] ?? false;

if (!is_string($name) || !is_string($email) || !is_string($message) || $privacy !== true) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$name = trim($name);
$email = trim($email);
$message = trim($message);

if (text_length($name) < 4 || text_length($name) > MAX_NAME_LENGTH || text_length($message) < 4 || text_length($message) > MAX_MESSAGE_LENGTH || strlen($email) > MAX_EMAIL_LENGTH) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid field length"]);
    exit;
}

if (preg_match('/[\r\n]/', $name) || preg_match('/[\r\n]/', $email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid contact details"]);
    exit;
}

if (!allow_request()) {
    http_response_code(429);
    echo json_encode(["error" => "Too many requests"]);
    exit;
}

$recipient = "info@jensbaumann.com";
$subject = "Neue Kontaktanfrage (Portfolio)";

$email_content = "Name: $name\n";
$email_content .= "E-Mail: $email\n\n";
$email_content .= "Nachricht:\n$message\n";

$headers = [
    "From" => "noreply@jensbaumann.com",
    "Reply-To" => $email,
    "Content-Type" => "text/plain; charset=UTF-8",
];

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

function text_length(string $value): int
{
    return function_exists("mb_strlen") ? mb_strlen($value, "UTF-8") : (int) preg_match_all('/./us', $value);
}
