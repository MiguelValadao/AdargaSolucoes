<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function clean_string(mixed $value, int $limit = 1000): string
{
    if (!is_string($value)) {
        return '';
    }

    return substr(trim($value), 0, $limit);
}

function html_escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    respond(405, ['error' => 'Método não permitido.']);
}

$payload = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($payload)) {
    respond(400, ['error' => 'Dados inválidos.']);
}

$name = clean_string($payload['nome'] ?? '', 120);
$email = clean_string($payload['email'] ?? '', 254);
$phone = clean_string($payload['telefone'] ?? '', 40);
$message = clean_string($payload['mensagem'] ?? '', 3000);
$vehicle = clean_string($payload['veiculo'] ?? '', 180);

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $phone === '') {
    respond(422, ['error' => 'Preencha nome, e-mail e telefone corretamente.']);
}

$apiKey = getenv('RESEND_API_KEY') ?: '';
$from = getenv('EMAIL_FROM') ?: '';
$recipient = getenv('CONTACT_TO_EMAIL') ?: '';

if ($apiKey === '' || $from === '' || $recipient === '') {
    error_log('Contact mailer is missing its required environment configuration.');
    respond(503, ['error' => 'O serviço de e-mail não está configurado.']);
}

$subject = $vehicle === ''
    ? "Novo contato pelo site — {$name}"
    : "Interesse em veículo — {$vehicle}";

$html = '<h2>Novo contato pelo site ADARGA</h2>'
    . '<p><strong>Nome:</strong> ' . html_escape($name) . '</p>'
    . '<p><strong>E-mail:</strong> ' . html_escape($email) . '</p>'
    . '<p><strong>Telefone:</strong> ' . html_escape($phone) . '</p>'
    . ($vehicle !== '' ? '<p><strong>Veículo:</strong> ' . html_escape($vehicle) . '</p>' : '')
    . '<p><strong>Mensagem:</strong><br>' . nl2br(html_escape($message !== '' ? $message : 'Sem mensagem adicional.')) . '</p>';

$emailPayload = [
    'from' => $from,
    'to' => [$recipient],
    'reply_to' => $email,
    'subject' => $subject,
    'html' => $html,
];

$request = curl_init('https://api.resend.com/emails');
curl_setopt_array($request, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($emailPayload, JSON_UNESCAPED_UNICODE),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ],
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 9,
]);

$response = curl_exec($request);
$status = (int) curl_getinfo($request, CURLINFO_RESPONSE_CODE);
$curlError = curl_error($request);
curl_close($request);

if ($response === false || $status < 200 || $status >= 300) {
    error_log('Contact mailer delivery failed: ' . ($curlError !== '' ? $curlError : "HTTP {$status}"));
    respond(502, ['error' => 'Não foi possível enviar o e-mail agora.']);
}

respond(200, ['ok' => true]);
