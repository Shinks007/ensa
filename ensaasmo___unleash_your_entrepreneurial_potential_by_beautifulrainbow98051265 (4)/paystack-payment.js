/**
 * Paystack Payment Integration
 * This file handles the client-side integration with Paystack
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get payment form and add submit event listener
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentFormSubmit);
    }

    // Initialize form fields based on URL parameters
    initializeFormFromUrlParams();
});

/**
 * Initialize form fields from URL parameters
 */
function initializeFormFromUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const packageParam = urlParams.get('package');
    const amountParam = urlParams.get('amount');

    // Set package name if provided
    if (packageParam) {
        const packageNameElement = document.getElementById('packageName');
        if (packageNameElement) {
            packageNameElement.textContent = packageParam;
        }
    }

    // Set amount if provided
    if (amountParam) {
        const amountElement = document.getElementById('amount');
        if (amountElement) {
            // Format amount with Naira symbol and thousands separator
            const formattedAmount = new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN'
            }).format(amountParam);

            amountElement.textContent = formattedAmount;
        }
    }
}

/**
 * Handle payment form submission
 * @param {Event} e - Form submit event
 */
function handlePaymentFormSubmit(e) {
    e.preventDefault();

    // Show loading state
    toggleLoadingState(true);

    // Validate form
    if (!validateForm()) {
        toggleLoadingState(false);
        return;
    }

    try {
        // Get form data
        const formData = getFormData();

        // Store form data in session storage for the success page
        sessionStorage.setItem('paymentFormData', JSON.stringify(formData));

        // Generate reference
        const reference = 'ENS_' + Math.floor((Math.random() * 1000000000) + 1) + '_' + new Date().getTime();

        // Get name parts
        const nameParts = formData.fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

        // Redirect to Paystack standard checkout
        const paystackUrl = `https://checkout.paystack.com/pk_test_31e4dc92bfa07b60b205af90441e6a33c2faea9a?email=${encodeURIComponent(formData.email)}&amount=${formData.amount * 100}&firstname=${encodeURIComponent(firstName)}&lastname=${encodeURIComponent(lastName)}&ref=${reference}&metadata=${encodeURIComponent(JSON.stringify({
            custom_fields: [
                {
                    display_name: "Full Name",
                    variable_name: "full_name",
                    value: formData.fullName
                },
                {
                    display_name: "State",
                    variable_name: "state",
                    value: formData.state
                },
                {
                    display_name: "LGA",
                    variable_name: "lga",
                    value: formData.lga
                },
                {
                    display_name: "Phone",
                    variable_name: "phone",
                    value: formData.phone
                },
                {
                    display_name: "Package",
                    variable_name: "package",
                    value: formData.package
                }
            ]
        }))}`;

        window.location.href = paystackUrl;
    } catch (error) {
        console.error('Payment error:', error);
        showError('An error occurred while processing your payment. Please try again.');
        toggleLoadingState(false);
    }
}

/**
 * Get form data from the payment form
 * @returns {Object} Form data object
 */
function getFormData() {
    const urlParams = new URLSearchParams(window.location.search);
    const packageParam = urlParams.get('package') || 'Standard Package';
    const amountParam = urlParams.get('amount') || '5000';

    return {
        package: packageParam,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        state: document.getElementById('state').value,
        lga: document.getElementById('lga').value,
        phone: document.getElementById('phone').value,
        amount: amountParam
    };
}

/**
 * Validate the payment form
 * @returns {boolean} True if form is valid, false otherwise
 */
function validateForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const state = document.getElementById('state').value;
    const lga = document.getElementById('lga').value;
    const phone = document.getElementById('phone').value.trim();

    // Reset previous error messages
    clearErrors();

    // Validate name (minimum 3 characters)
    if (fullName.length < 3) {
        showFieldError('fullName', 'Please enter your full name (at least 3 characters)');
        return false;
    }

    // Validate email (must be valid email format)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        return false;
    }

    // Validate state (must be selected)
    if (!state || state === '') {
        showFieldError('state', 'Please select your state');
        return false;
    }

    // Validate LGA (must be selected)
    if (!lga || lga === '') {
        showFieldError('lga', 'Please select your LGA');
        return false;
    }

    // Validate phone (must be valid phone format)
    if (!/^\+?[\d\s-]{10,}$/.test(phone)) {
        showFieldError('phone', 'Please enter a valid phone number');
        return false;
    }

    return true;
}

/**
 * Show error message for a specific field
 * @param {string} fieldId - ID of the field with error
 * @param {string} message - Error message to display
 */
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;

    field.classList.add('error');
    field.parentNode.appendChild(errorElement);
}

/**
 * Clear all error messages
 */
function clearErrors() {
    // Remove error class from all fields
    const fields = document.querySelectorAll('.form-group input, .form-group select');
    fields.forEach(field => field.classList.remove('error'));

    // Remove all error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(element => element.remove());
}

/**
 * Show general error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    } else {
        alert(message);
    }
}

/**
 * Toggle loading state of the form
 * @param {boolean} isLoading - Whether the form is in loading state
 */
function toggleLoadingState(isLoading) {
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        if (isLoading) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner"></span> Processing...';
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Pay Now';
        }
    }
}
