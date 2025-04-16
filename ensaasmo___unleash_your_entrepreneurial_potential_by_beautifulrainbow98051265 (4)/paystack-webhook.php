<?php
/**
 * Paystack Webhook Handler
 * This script handles webhook events from Paystack
 */

// Set your Paystack secret key
$secretKey = "sk_test_3a9712dd9856f38b6b0875f553cba64a866422f6"; // Paystack secret key

// Only a post with Paystack signature header gets our attention
if ((strtoupper($_SERVER['REQUEST_METHOD']) != 'POST') || !array_key_exists('HTTP_X_PAYSTACK_SIGNATURE', $_SERVER)) {
    // Log invalid request
    error_log('Invalid Paystack webhook request method or missing signature header');
    http_response_code(400);
    exit();
}

// Retrieve the request's body
$input = file_get_contents('php://input');

// Validate event with signature
$signature = $_SERVER['HTTP_X_PAYSTACK_SIGNATURE'];
if (!hash_equals(hash_hmac('sha512', $input, $secretKey), $signature)) {
    // Log invalid signature
    error_log('Invalid Paystack webhook signature: ' . $signature);
    http_response_code(400);
    exit();
}

// Parse event payload
$event = json_decode($input);

// Verify event structure
if (!$event || !isset($event->event) || !isset($event->data)) {
    error_log('Invalid Paystack webhook payload');
    http_response_code(400);
    exit();
}

// Log the event for debugging
error_log('Paystack webhook received: ' . $event->event);

// Process different event types
switch($event->event) {
    case 'charge.success':
        handleSuccessfulCharge($event->data);
        break;

    case 'subscription.create':
        handleSubscriptionCreated($event->data);
        break;

    case 'subscription.disable':
        handleSubscriptionDisabled($event->data);
        break;

    case 'invoice.payment_failed':
        handlePaymentFailed($event->data);
        break;

    default:
        // Log unhandled event type
        error_log('Unhandled Paystack event type: ' . $event->event);
        break;
}

// Respond with 200 OK
http_response_code(200);
echo "Webhook received";

/**
 * Handle successful charge event
 * @param object $data Event data
 */
function handleSuccessfulCharge($data) {
    // Extract transaction details
    $reference = $data->reference;
    $amount = $data->amount / 100; // Convert from kobo to naira
    $email = $data->customer->email;
    $metadata = $data->metadata ?? new stdClass();

    // Extract customer details from metadata
    $fullName = '';
    $state = '';
    $lga = '';
    $phone = '';
    $package = '';

    if (isset($metadata->custom_fields) && is_array($metadata->custom_fields)) {
        foreach ($metadata->custom_fields as $field) {
            switch ($field->variable_name) {
                case 'full_name':
                    $fullName = $field->value;
                    break;
                case 'state':
                    $state = $field->value;
                    break;
                case 'lga':
                    $lga = $field->value;
                    break;
                case 'phone':
                    $phone = $field->value;
                    break;
                case 'package':
                    $package = $field->value;
                    break;
            }
        }
    }

    // Log the successful payment
    error_log("Payment successful: Reference: $reference, Amount: $amount, Email: $email, Package: $package");

    // Here you would typically:
    // 1. Update your database to mark the payment as successful
    // 2. Activate the user's subscription or provide access to purchased content
    // 3. Send a confirmation email to the customer

    // Example: Send confirmation email
    sendPaymentConfirmationEmail($email, $fullName, $reference, $amount, $package);

    // Example: Save payment to database
    savePaymentToDatabase($reference, $email, $fullName, $amount, $package, $state, $lga, $phone);
}

/**
 * Handle subscription created event
 * @param object $data Event data
 */
function handleSubscriptionCreated($data) {
    // Log subscription creation
    error_log('Subscription created: ' . json_encode($data));

    // Here you would typically:
    // 1. Update your database with subscription details
    // 2. Send a welcome email to the subscriber
}

/**
 * Handle subscription disabled event
 * @param object $data Event data
 */
function handleSubscriptionDisabled($data) {
    // Log subscription disabled
    error_log('Subscription disabled: ' . json_encode($data));

    // Here you would typically:
    // 1. Update your database to mark the subscription as inactive
    // 2. Send a notification to the customer
}

/**
 * Handle payment failed event
 * @param object $data Event data
 */
function handlePaymentFailed($data) {
    // Log payment failure
    error_log('Payment failed: ' . json_encode($data));

    // Here you would typically:
    // 1. Update your database to mark the payment as failed
    // 2. Send a notification to the customer
}

/**
 * Send payment confirmation email
 * @param string $email Customer email
 * @param string $fullName Customer name
 * @param string $reference Transaction reference
 * @param float $amount Transaction amount
 * @param string $package Package purchased
 */
function sendPaymentConfirmationEmail($email, $fullName, $reference, $amount, $package) {
    // This is a placeholder function
    // In a real implementation, you would use a proper email sending library

    $subject = 'Payment Confirmation - Ensaasmo';

    $message = "
    Dear $fullName,

    Thank you for your payment of ₦$amount for the $package package.

    Your transaction reference is: $reference

    You can now access your assessment and resources on our platform.

    Best regards,
    The Ensaasmo Team
    ";

    // Log email sending attempt
    error_log("Sending confirmation email to: $email for reference: $reference");

    // In a real implementation, you would send the email here
    // mail($email, $subject, $message);
}

/**
 * Save payment to database
 * @param string $reference Transaction reference
 * @param string $email Customer email
 * @param string $fullName Customer name
 * @param float $amount Transaction amount
 * @param string $package Package purchased
 * @param string $state Customer state
 * @param string $lga Customer LGA
 * @param string $phone Customer phone
 */
function savePaymentToDatabase($reference, $email, $fullName, $amount, $package, $state, $lga, $phone) {
    // This is a placeholder function
    // In a real implementation, you would connect to your database and save the payment

    // Log database saving attempt
    error_log("Saving payment to database: Reference: $reference, Email: $email, Amount: $amount, Package: $package");

    // Example database connection and query (commented out)
    /*
    $conn = new mysqli('localhost', 'username', 'password', 'database');
    if ($conn->connect_error) {
        error_log('Database connection failed: ' . $conn->connect_error);
        return;
    }

    $stmt = $conn->prepare("INSERT INTO payments (reference, email, full_name, amount, package, state, lga, phone, payment_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("sssdssss", $reference, $email, $fullName, $amount, $package, $state, $lga, $phone);

    if (!$stmt->execute()) {
        error_log('Failed to save payment to database: ' . $stmt->error);
    }

    $stmt->close();
    $conn->close();
    */
}
?>
