<?php
// Set your Paystack secret key
$secretKey = "sk_your_paystack_secret_key";

// Get the reference from the URL
$reference = isset($_GET['reference']) ? $_GET['reference'] : '';

if(!$reference) {
    die('No reference supplied');
}

// Initialize cURL
$curl = curl_init();

// Set cURL options
curl_setopt_array($curl, array(
    CURLOPT_URL => "https://api.paystack.co/transaction/verify/" . rawurlencode($reference),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "accept: application/json",
        "authorization: Bearer " . $secretKey,
        "cache-control: no-cache"
    ],
));

// Execute cURL request
$response = curl_exec($curl);
$err = curl_error($curl);

// Close cURL connection
curl_close($curl);

if($err) {
    // There was an error with the request
    die('Curl returned error: ' . $err);
}

// Parse the response
$tranx = json_decode($response);

// Check if the transaction was successful
if(!$tranx->status) {
    // There was an error from Paystack
    die('API returned error: ' . $tranx->message);
}

if('success' == $tranx->data->status) {
    // Transaction was successful
    // Store transaction details in your database
    // You can access transaction details using $tranx->data
    
    // Return success response
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'message' => 'Payment verified successfully',
        'data' => [
            'reference' => $tranx->data->reference,
            'amount' => $tranx->data->amount / 100, // Convert from kobo to naira
            'paid_at' => $tranx->data->paid_at,
            'channel' => $tranx->data->channel,
            'currency' => $tranx->data->currency,
            'customer' => [
                'email' => $tranx->data->customer->email,
                'name' => $tranx->data->metadata->custom_fields[0]->value ?? 'N/A', // Full name from metadata
            ],
            'metadata' => $tranx->data->metadata
        ]
    ]);
} else {
    // Transaction was not successful
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => 'Payment verification failed',
        'data' => [
            'reference' => $tranx->data->reference,
            'status' => $tranx->data->status
        ]
    ]);
}
?>
