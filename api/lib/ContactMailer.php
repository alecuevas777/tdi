<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

final class ContactMailer
{
    private const SERVICE_LABELS = [
        'vender' => 'Quiero vender una propiedad',
        'arrendar' => 'Quiero arrendar mi propiedad',
        'buscar' => 'Estoy buscando una propiedad',
        'administracion' => 'Administración de propiedades',
        'obras' => 'Obras y remodelaciones',
        'arquitectura' => 'Arquitectura y permisos',
        'inversion' => 'Inversión inmobiliaria',
        'otra' => 'Otra consulta',
    ];

    public function __construct(private array $config)
    {
    }

    /**
     * @param array{name: string, email: string, phone: string, service: string, location: string, message: string} $data
     */
    public function send(array $data): void
    {
        $mail = new PHPMailer(true);

        try {
            $smtp = $this->config['smtp'];
            $mailConfig = $this->config['mail'];

            $mail->isSMTP();
            $mail->Host = $smtp['host'];
            $mail->SMTPAuth = true;
            $mail->Username = $smtp['username'];
            $mail->Password = $smtp['password'];
            $mail->SMTPSecure = $smtp['encryption'];
            $mail->Port = (int) $smtp['port'];
            $mail->CharSet = 'UTF-8';

            $mail->setFrom($mailConfig['from_email'], $mailConfig['from_name']);
            $mail->addAddress($mailConfig['to_email']);

            if ($data['email'] !== '') {
                $mail->addReplyTo($data['email'], $data['name']);
            }

            $mail->Subject = 'Consulta TDI — ' . $this->serviceLabel($data['service']);
            $mail->isHTML(true);
            $mail->Body = $this->buildHtmlBody($data);
            $mail->AltBody = $this->buildTextBody($data);

            $mail->send();
        } catch (Exception $exception) {
            throw new RuntimeException(
                'No se pudo enviar el correo: ' . $mail->ErrorInfo,
                0,
                $exception
            );
        }
    }

    private function serviceLabel(string $service): string
    {
        return self::SERVICE_LABELS[$service] ?? $service;
    }

    /**
     * @param array{name: string, email: string, phone: string, service: string, location: string, message: string} $data
     */
    private function buildHtmlBody(array $data): string
    {
        $name = htmlspecialchars($data['name'], ENT_QUOTES, 'UTF-8');
        $phone = htmlspecialchars($data['phone'], ENT_QUOTES, 'UTF-8');
        $email = htmlspecialchars($data['email'], ENT_QUOTES, 'UTF-8');
        $service = htmlspecialchars($this->serviceLabel($data['service']), ENT_QUOTES, 'UTF-8');
        $location = htmlspecialchars($data['location'], ENT_QUOTES, 'UTF-8');
        $message = nl2br(htmlspecialchars($data['message'], ENT_QUOTES, 'UTF-8'));

        $emailRow = $data['email'] !== ''
            ? "<p><strong>Correo:</strong> {$email}</p>"
            : '';
        $locationRow = $data['location'] !== ''
            ? "<p><strong>Comuna o sector:</strong> {$location}</p>"
            : '';

        return <<<HTML
        <h2>Nueva consulta desde el sitio web</h2>
        <p><strong>Nombre:</strong> {$name}</p>
        <p><strong>Teléfono:</strong> {$phone}</p>
        {$emailRow}
        <p><strong>Consulta:</strong> {$service}</p>
        {$locationRow}
        <p><strong>Mensaje:</strong></p>
        <p>{$message}</p>
        HTML;
    }

    /**
     * @param array{name: string, email: string, phone: string, service: string, location: string, message: string} $data
     */
    private function buildTextBody(array $data): string
    {
        $lines = [
            'Nueva consulta desde el sitio web',
            '',
            'Nombre: ' . $data['name'],
            'Teléfono: ' . $data['phone'],
        ];

        if ($data['email'] !== '') {
            $lines[] = 'Correo: ' . $data['email'];
        }

        $lines[] = 'Consulta: ' . $this->serviceLabel($data['service']);

        if ($data['location'] !== '') {
            $lines[] = 'Comuna o sector: ' . $data['location'];
        }

        $lines[] = '';
        $lines[] = 'Mensaje:';
        $lines[] = $data['message'];

        return implode("\n", $lines);
    }
}
