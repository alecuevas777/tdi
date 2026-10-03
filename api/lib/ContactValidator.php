<?php

declare(strict_types=1);

final class ContactValidator
{
    private const CONSULTA_VALUES = [
        'vender',
        'arrendar',
        'buscar',
        'administracion',
        'obras',
        'arquitectura',
        'inversion',
        'otra',
    ];

    /**
     * @param array<string, mixed> $data
     * @return array{valid: bool, honeypot: bool, errors: array<string, string>, sanitized: array<string, string>}
     */
    public function validate(array $data): array
    {
        $errors = [];

        $name = $this->sanitizeText((string) ($data['name'] ?? $data['nombre'] ?? ''), 80);
        $email = strtolower(trim((string) ($data['email'] ?? $data['correo'] ?? '')));
        $phone = $this->sanitizeText((string) ($data['phone'] ?? $data['telefono'] ?? ''), 40);
        $service = $this->sanitizeText((string) ($data['service'] ?? $data['consulta'] ?? ''), 80);
        $location = $this->sanitizeText((string) ($data['location'] ?? $data['comuna'] ?? ''), 120);
        $message = $this->sanitizeText((string) ($data['message'] ?? $data['mensaje'] ?? ''), 10000);
        $honeypot = trim((string) ($data['tdi_hp'] ?? $data['cw911_hp'] ?? ''));

        if ($honeypot !== '') {
            error_log('[contact] honeypot triggered — mail not sent');
            return [
                'valid' => true,
                'honeypot' => true,
                'errors' => [],
                'sanitized' => [],
            ];
        }

        if ($name === '') {
            $errors['name'] = 'El nombre es obligatorio.';
        } elseif (mb_strlen($name) < 2) {
            $errors['name'] = 'Ingresa un nombre válido.';
        }

        if ($phone === '') {
            $errors['phone'] = 'El teléfono es obligatorio.';
        } elseif (preg_match_all('/\d/u', $phone) < 8) {
            $errors['phone'] = 'Ingresa un teléfono válido.';
        }

        if ($email !== '') {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors['email'] = 'Ingresa un correo válido.';
            } elseif (mb_strlen($email) > 120) {
                $errors['email'] = 'El correo es demasiado largo.';
            }
        }

        if ($service === '' || !in_array($service, self::CONSULTA_VALUES, true)) {
            $errors['service'] = 'Selecciona una opción.';
        }

        if ($message === '') {
            $errors['message'] = 'Cuéntanos brevemente tu caso.';
        }

        return [
            'valid' => $errors === [],
            'honeypot' => false,
            'errors' => $errors,
            'sanitized' => [
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'service' => $service,
                'location' => $location,
                'message' => $message,
            ],
        ];
    }

    private function sanitizeText(string $value, int $maxLength): string
    {
        $value = trim($value);
        $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';

        if (mb_strlen($value) > $maxLength) {
            $value = mb_substr($value, 0, $maxLength);
        }

        return $value;
    }
}
