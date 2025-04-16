<?php
// Initialize transaction with Paystack
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $amount = filter_input(INPUT_POST, 'amount', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION) * 100; // Convert to kobo
    $firstName = filter_input(INPUT_POST, 'firstName', FILTER_SANITIZE_STRING);
    $lastName = filter_input(INPUT_POST, 'lastName', FILTER_SANITIZE_STRING);
    
    // Generate reference
    $reference = 'SERVER_' . uniqid() . '_' . time();
    
    // Prepare the request to Paystack
    $url = 'https://api.paystack.co/transaction/initialize';
    $fields = [
        'email' => $email,
        'amount' => $amount,
        'reference' => $reference,
        'metadata' => [
            'first_name' => $firstName,
            'last_name' => $lastName
        ]
    ];
    
    // Initialize cURL
    $ch = curl_init();
    
    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer sk_test_3a9712dd9856f38b6b0875f553cba64a866422f6',
        'Content-Type: application/json',
        'Cache-Control: no-cache'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    // Execute cURL request
    $response = curl_exec($ch);
    $err = curl_error($ch);
    
    // Close cURL connection
    curl_close($ch);
    
    // Handle response
    if ($err) {
        // cURL error
        $result = [
            'status' => false,
            'message' => 'cURL Error: ' . $err
        ];
    } else {
        // Parse response
        $result = json_decode($response, true);
    }
    
    // Return JSON response
    header('Content-Type: application/json');
    echo json_encode($result);
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server-Side Paystack Payment</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            background-color: #0066cc;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        }
        button:hover {
            background-color: #0052a3;
        }
        .error {
            color: red;
            margin-top: 10px;
        }
        .loading {
            display: none;
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>Server-Side Paystack Payment</h1>
    
    <form id="paymentForm">
        <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" required>
        </div>
        
        <div class="form-group">
            <label for="amount">Amount (NGN)</label>
            <input type="number" id="amount" value="5000" required>
        </div>
        
        <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" required>
        </div>
        
        <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" required>
        </div>
        
        <div id="error-container" class="error"></div>
        
        <button type="button" onclick="initializePayment()">Pay Now</button>
    </form>
    
    <div id="loading" class="loading">
        <p>Initializing payment...</p>
    </div>
    
    <script>
        function initializePayment() {
            // Clear any previous errors
            document.getElementById('error-container').textContent = '';
            
            // Get form values
            const email = document.getElementById('email').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            
            // Validate form
            if (!email || !amount || !firstName || !lastName) {
                document.getElementById('error-container').textContent = 'Please fill all fields';
                return;
            }
            
            // Show loading
            document.getElementById('loading').style.display = 'block';
            
            // Create form data
            const formData = new FormData();
            formData.append('email', email);
            formData.append('amount', amount);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            
            // Send request to server
            fetch('server-payment.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Hide loading
                document.getElementById('loading').style.display = 'none';
                
                if (data.status) {
                    // Redirect to Paystack checkout
                    window.location.href = data.data.authorization_url;
                } else {
                    // Show error
                    document.getElementById('error-container').textContent = data.message || 'An error occurred';
                }
            })
            .catch(error => {
                // Hide loading
                document.getElementById('loading').style.display = 'none';
                
                // Show error
                document.getElementById('error-container').textContent = 'An error occurred: ' + error.message;
                console.error('Error:', error);
            });
        }
    </script>
</body>
</html>
