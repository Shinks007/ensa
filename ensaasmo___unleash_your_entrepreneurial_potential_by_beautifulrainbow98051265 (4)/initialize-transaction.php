<?php
/**
 * Initialize Transaction with Paystack
 * This script handles the server-side initialization of a Paystack transaction
 */

// Set headers for JSON response
header('Content-Type: application/json');

// Get the request body
$input = file_get_contents('php://input');
$requestData = json_decode($input, true);

// Validate request data
if (!$requestData || !isset($requestData['email']) || !isset($requestData['amount'])) {
    http_response_code(400);
    echo json_encode([
        'status' => false,
        'message' => 'Invalid request data'
    ]);
    exit;
}

// Extract data from request
$email = filter_var($requestData['email'], FILTER_SANITIZE_EMAIL);
$amount = intval($requestData['amount']) * 100; // Convert to kobo (Paystack uses the lowest currency unit)
$fullName = isset($requestData['fullName']) ? filter_var($requestData['fullName'], FILTER_SANITIZE_STRING) : '';
$state = isset($requestData['state']) ? filter_var($requestData['state'], FILTER_SANITIZE_STRING) : '';
$lga = isset($requestData['lga']) ? filter_var($requestData['lga'], FILTER_SANITIZE_STRING) : '';
$phone = isset($requestData['phone']) ? filter_var($requestData['phone'], FILTER_SANITIZE_STRING) : '';
$package = isset($requestData['package']) ? filter_var($requestData['package'], FILTER_SANITIZE_STRING) : '';
$affiliate = isset($requestData['affiliate']) ? filter_var($requestData['affiliate'], FILTER_SANITIZE_STRING) : '';

// Generate a unique reference
$reference = 'ENS_' . uniqid() . '_' . time();

// Prepare metadata
$metadata = [
    'custom_fields' => [
        [
            'display_name' => 'Full Name',
            'variable_name' => 'full_name',
            'value' => $fullName
        ],
        [
            'display_name' => 'State',
            'variable_name' => 'state',
            'value' => $state
        ],
        [
            'display_name' => 'LGA',
            'variable_name' => 'lga',
            'value' => $lga
        ],
        [
            'display_name' => 'Phone',
            'variable_name' => 'phone',
            'value' => $phone
        ],
        [
            'display_name' => 'Package',
            'variable_name' => 'package',
            'value' => $package
        ]
    ]
];

// Add affiliate info if available
if (!empty($affiliate)) {
    $metadata['custom_fields'][] = [
        'display_name' => 'Affiliate',
        'variable_name' => 'affiliate',
        'value' => $affiliate
    ];
}

// Prepare the request to Paystack
$url = 'https://api.paystack.co/transaction/initialize';
$fields = [
    'email' => $email,
    'amount' => $amount,
    'reference' => $reference,
    'callback_url' => 'https://' . $_SERVER['HTTP_HOST'] . '/success.html',
    'metadata' => $metadata
];

// Your Paystack secret key
$secretKey = 'sk_live_YOUR_LIVE_SECRET_KEY'; // Your Paystack live secret key

// Initialize cURL
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $secretKey,
    'Content-Type: application/json',
    'Cache-Control: no-cache'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute cURL request
$response = curl_exec($ch);
$err = curl_error($ch);

// Close cURL connection
curl_close($ch);

// Handle errors
if ($err) {
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'message' => 'cURL Error: ' . $err
    ]);
    exit;
}

// Parse response
$result = json_decode($response, true);

// Check if the request was successful
if (!$result['status']) {
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'message' => 'Paystack Error: ' . ($result['message'] ?? 'Unknown error')
    ]);
    exit;
}

// Return the access code to the client
echo json_encode([
    'status' => true,
    'message' => 'Transaction initialized',
    'access_code' => $result['data']['access_code'],
    'reference' => $result['data']['reference']
]);
?>
