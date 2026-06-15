<?php

declare(strict_types=1);

$recipient = 'info@jensbaumann.com';
$fromAddress = 'noreply@jensbaumann.com';
$subjectPrefix = '[Portfolio Kontakt]';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    $data = $_POST;
}

$name = trim((string)($data['name'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$message = trim((string)($data['message'] ?? ''));
$honeypot = trim((string)($data['company'] ?? ''));

if ($honeypot !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

$errors = [];

if (mb_strlen($name) < 4 || mb_strlen($name) > 100) {
    $errors[] = 'name';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 150) {
    $errors[] = 'email';
}

if (mb_strlen($message) < 4 || mb_strlen($message) > 5000) {
    $errors[] = 'message';
}

if ($errors !== []) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'validation', 'fields' => $errors]);
    exit;
}

$cleanName = str_replace(["\r", "\n"], ' ', $name);
$cleanEmail = str_replace(["\r", "\n"], ' ', $email);

$subject = sprintf('%s %s', $subjectPrefix, $cleanName);

$body = "Neue Nachricht über das Kontaktformular:\n\n"
    . "Name: {$cleanName}\n"
    . "E-Mail: {$cleanEmail}\n\n"
    . "Nachricht:\n{$message}\n";

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . $fromAddress,
    'Reply-To: =?UTF-8?B?' . base64_encode($cleanName) . '?= <' . $cleanEmail . '>',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail(
    $recipient,
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    $body,
    implode("\r\n", $headers)
);

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'send_failed']);
    exit;
}

echo json_encode(['ok' => true]);
