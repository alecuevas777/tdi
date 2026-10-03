<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/lib/Env.php';
require __DIR__ . '/lib/ContactValidator.php';
require __DIR__ . '/lib/ContactMailer.php';

header('Content-Type: application/json; charset=utf-8');

$envPath = __DIR__ . '/.env';

if (!is_readable($envPath)) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => [
            'code' => 'NOT_CONFIGURED',
            'message' => 'La API no está configurada. Falta el archivo .env en el servidor.',
        ],
    ]);
    exit;
}

Env::load($envPath);

$configPath = __DIR__ . '/config.php';

if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => [
            'code' => 'NOT_CONFIGURED',
            'message' => 'La API no está configurada. Falta el archivo config.php en el servidor.',
        ],
    ]);
    exit;
}

$config = require $configPath;
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = $config['allowed_origins'] ?? [];

if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'error' => [
            'code' => 'METHOD_NOT_ALLOWED',
            'message' => 'Usa POST para enviar el formulario de contacto.',
        ],
    ]);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput ?: '', true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'error' => [
            'code' => 'INVALID_JSON',
            'message' => 'No se pudo leer el cuerpo de la solicitud.',
        ],
    ]);
    exit;
}

try {
    $validator = new ContactValidator();
    $result = $validator->validate($data);

    if (!empty($result['honeypot'])) {
        echo json_encode([
            'ok' => true,
            'data' => [
                'id' => bin2hex(random_bytes(16)),
                'receivedAt' => gmdate('c'),
                'message' => 'Mensaje recibido. Te contactaremos pronto.',
            ],
        ]);
        exit;
    }

    if (!$result['valid']) {
        http_response_code(422);
        echo json_encode([
            'ok' => false,
            'error' => [
                'code' => 'VALIDATION_ERROR',
                'message' => 'Los datos del formulario no son válidos.',
                'fields' => $result['errors'],
            ],
        ]);
        exit;
    }

    $smtpUser = trim((string) ($config['smtp']['username'] ?? ''));
    $smtpPass = (string) ($config['smtp']['password'] ?? '');
    $toEmail = trim((string) ($config['mail']['to_email'] ?? ''));

    if ($smtpUser === '' || $smtpPass === '' || $toEmail === '') {
        http_response_code(500);
        echo json_encode([
            'ok' => false,
            'error' => [
                'code' => 'NOT_CONFIGURED',
                'message' => 'La API aún no tiene el correo del dominio configurado.',
            ],
        ]);
        exit;
    }

    error_log('[contact] sending mail');

    $mailer = new ContactMailer($config);
    $mailer->send($result['sanitized']);

    error_log('[contact] mail sent OK');

    echo json_encode([
        'ok' => true,
        'data' => [
            'id' => bin2hex(random_bytes(16)),
            'receivedAt' => gmdate('c'),
            'message' => 'Mensaje recibido. Te contactaremos pronto.',
        ],
    ]);
} catch (Throwable $exception) {
    error_log('[contact.php] ' . $exception->getMessage());

    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'error' => [
            'code' => 'DELIVERY_FAILED',
            'message' => 'No pudimos enviar tu mensaje. Intenta más tarde.',
        ],
    ]);
}
