<?php

declare(strict_types=1);

http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'ok' => false,
    'error' => [
        'code' => 'NOT_FOUND',
        'message' => 'Usa POST /contact.php',
    ],
]);
