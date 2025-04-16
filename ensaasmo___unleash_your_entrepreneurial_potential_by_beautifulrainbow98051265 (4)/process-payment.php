<?php
/**
 * Process Payment with Paystack
 * This script handles the server-side initialization of a Paystack transaction
 */

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    // Redirect to payment page if accessed directly
    header('Location: payment-server.html');
    exit;
}

// Get form data
$fullName = filter_input(INPUT_POST, 'fullName', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
$state = filter_input(INPUT_POST, 'state', FILTER_SANITIZE_STRING);
$lga = filter_input(INPUT_POST, 'lga', FILTER_SANITIZE_STRING);
$package = filter_input(INPUT_POST, 'package', FILTER_SANITIZE_STRING) ?: 'Standard Package';
$amount = filter_input(INPUT_POST, 'amount', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION) ?: 5000;
$affiliate = filter_input(INPUT_POST, 'affiliate', FILTER_SANITIZE_STRING) ?: '';

// Convert amount to kobo (Paystack uses the lowest currency unit)
$amountInKobo = $amount * 100;

// Generate a unique reference
$reference = 'ENS_' . uniqid() . '_' . time();

// Split full name into first name and last name
$nameParts = explode(' ', $fullName);
$firstName = $nameParts[0] ?? '';
$lastName = end($nameParts) ?? '';

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
if ($affiliate) {
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
    'amount' => $amountInKobo,
    'reference' => $reference,
    'callback_url' => 'https://' . $_SERVER['HTTP_HOST'] . '/success-new.html',
    'metadata' => $metadata
];

// Your Paystack secret key
$secretKey = 'sk_test_3a9712dd9856f38b6b0875f553cba64a866422f6';

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
    // Log the error
    error_log('Paystack cURL Error: ' . $err);

    // Display error page
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Error | Ensaasmo</title>
        <link rel="stylesheet" href="styles.css">
        <style>
            .error-container {
                max-width: 600px;
                margin: 100px auto;
                padding: 30px;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                text-align: center;
            }
            .error-icon {
                color: #e53935;
                font-size: 60px;
                margin-bottom: 20px;
            }
            .error-title {
                font-size: 24px;
                margin-bottom: 15px;
                color: #333;
            }
            .error-message {
                color: #666;
                margin-bottom: 25px;
            }
            .back-button {
                display: inline-block;
                background-color: #0066cc;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                text-decoration: none;
                font-weight: bold;
            }
            .back-button:hover {
                background-color: #0052a3;
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <div class="error-icon">❌</div>
            <h1 class="error-title">Payment Error</h1>
            <p class="error-message">We encountered an error while processing your payment. Please try again later.</p>
            <a href="payment-server.html" class="back-button">Back to Payment</a>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Parse response
$result = json_decode($response, true);

// Check if the request was successful
if (!$result['status']) {
    // Log the error
    error_log('Paystack Error: ' . ($result['message'] ?? 'Unknown error'));

    // Display error page
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Error | Ensaasmo</title>
        <link rel="stylesheet" href="styles.css">
        <style>
            .error-container {
                max-width: 600px;
                margin: 100px auto;
                padding: 30px;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                text-align: center;
            }
            .error-icon {
                color: #e53935;
                font-size: 60px;
                margin-bottom: 20px;
            }
            .error-title {
                font-size: 24px;
                margin-bottom: 15px;
                color: #333;
            }
            .error-message {
                color: #666;
                margin-bottom: 25px;
            }
            .back-button {
                display: inline-block;
                background-color: #0066cc;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                text-decoration: none;
                font-weight: bold;
            }
            .back-button:hover {
                background-color: #0052a3;
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <div class="error-icon">❌</div>
            <h1 class="error-title">Payment Error</h1>
            <p class="error-message">Error: <?php echo htmlspecialchars($result['message'] ?? 'Unknown error'); ?></p>
            <a href="payment-server.html" class="back-button">Back to Payment</a>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Store form data in session for the success page
session_start();
$_SESSION['paymentFormData'] = [
    'fullName' => $fullName,
    'email' => $email,
    'phone' => $phone,
    'state' => $state,
    'lga' => $lga,
    'package' => $package,
    'amount' => $amount,
    'reference' => $reference,
    'affiliate' => $affiliate
];

// Redirect to Paystack payment page
header('Location: ' . $result['data']['authorization_url']);
exit;
?>
