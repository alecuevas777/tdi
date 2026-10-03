<?php

/**
 * Router for PHP built-in server during local development.
 * Maps /api/contact.php → contact.php so the Next.js proxy path matches production.
 *
 * Usage:
 *   php -S localhost:8080 -t . router-dev.php
 */

declare(strict_types=1);

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/');

if ($uri === '/api/contact.php' || $uri === '/contact.php') {
    require __DIR__ . '/contact.php';
    return true;
}

if ($uri === '/' || $uri === '/index.php' || $uri === '/api' || $uri === '/api/') {
    require __DIR__ . '/index.php';
    return true;
}

$file = __DIR__ . $uri;
if ($uri !== '/' && is_file($file)) {
    return false;
}

http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'ok' => false,
    'error' => [
        'code' => 'NOT_FOUND',
        'message' => 'Ruta no encontrada.',
    ],
]);

return true;
