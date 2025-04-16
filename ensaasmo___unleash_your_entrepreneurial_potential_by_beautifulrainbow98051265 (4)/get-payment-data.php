<?php
/**
 * Get Payment Data from Session
 * This script retrieves payment data from the PHP session
 */

// Set headers for JSON response
header('Content-Type: application/json');

// Start session
session_start();

// Get reference from query string
$reference = isset($_GET['reference']) ? $_GET['reference'] : '';

// Check if we have payment data in session
if (isset($_SESSION['paymentFormData']) && $_SESSION['paymentFormData']['reference'] === $reference) {
    // Return payment data
    echo json_encode([
        'status' => true,
        'message' => 'Payment data found',
        'data' => $_SESSION['paymentFormData']
    ]);
    
    // Clear session data
    unset($_SESSION['paymentFormData']);
} else {
    // No payment data found
    echo json_encode([
        'status' => false,
        'message' => 'No payment data found for reference: ' . $reference
    ]);
}
?>
