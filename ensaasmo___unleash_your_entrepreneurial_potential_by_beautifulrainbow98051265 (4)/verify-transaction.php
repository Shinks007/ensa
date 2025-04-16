<?php
/**
 * Verify Transaction with Paystack
 * This script verifies the status of a transaction with Paystack
 */

// Set headers for JSON response
header('Content-Type: application/json');

// Get the transaction reference from the request
$reference = isset($_GET['reference']) ? $_GET['reference'] : '';

// Validate reference
if (!$reference) {
    http_response_code(400);
    echo json_encode([
        'status' => false,
        'message' => 'No reference provided'
    ]);
    exit;
}

// Your Paystack secret key
$secretKey = 'sk_test_3a9712dd9856f38b6b0875f553cba64a866422f6'; // Paystack secret key

// Initialize cURL
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, 'https://api.paystack.co/transaction/verify/' . rawurlencode($reference));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $secretKey,
    'Cache-Control: no-cache'
]);

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

// Check if the transaction was successful
if ($result['data']['status'] !== 'success') {
    echo json_encode([
        'status' => false,
        'message' => 'Transaction was not successful',
        'data' => [
            'reference' => $result['data']['reference'],
            'status' => $result['data']['status']
        ]
    ]);
    exit;
}

// Transaction was successful
echo json_encode([
    'status' => true,
    'message' => 'Transaction verified successfully',
    'data' => [
        'reference' => $result['data']['reference'],
        'amount' => $result['data']['amount'] / 100, // Convert from kobo to naira
        'status' => $result['data']['status'],
        'paid_at' => $result['data']['paid_at'],
        'channel' => $result['data']['channel'],
        'currency' => $result['data']['currency'],
        'customer' => [
            'email' => $result['data']['customer']['email']
        ],
        'metadata' => $result['data']['metadata'] ?? []
    ]
]);
?>
