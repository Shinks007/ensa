/**
 * Paystack Integration for Ensaasmo
 * This file handles the client-side integration with Paystack payment gateway
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get payment form
    const paymentForm = document.getElementById('paymentForm');
    
    // Initialize form with URL parameters if available
    initializeFormFromUrlParams();
    
    // Setup state and LGA dropdowns
    setupStateAndLGA();
    
    // Add form submission handler
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmit);
    }
});

/**
 * Initialize form fields from URL parameters
 */
function initializeFormFromUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const packageParam = urlParams.get('package');
    const amountParam = urlParams.get('amount');
    const affiliateParam = urlParams.get('ref');
    
    // Set package name if provided
    if (packageParam) {
        const packageNameElement = document.getElementById('packageName');
        if (packageNameElement) {
            packageNameElement.textContent = decodeURIComponent(packageParam);
        }
        
        // Store package in hidden input
        const packageInput = document.getElementById('packageInput');
        if (packageInput) {
            packageInput.value = decodeURIComponent(packageParam);
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
        
        // Store amount in hidden input
        const amountInput = document.getElementById('amountInput');
        if (amountInput) {
            amountInput.value = amountParam;
        }
    }
    
    // Set affiliate if provided
    if (affiliateParam) {
        const affiliateInput = document.getElementById('affiliateInput');
        if (affiliateInput) {
            affiliateInput.value = decodeURIComponent(affiliateParam);
        }
        
        // Show affiliate section if it exists
        const affiliateSection = document.querySelector('.affiliate-section');
        const affiliateNameSpan = document.getElementById('affiliateName');
        
        if (affiliateSection && affiliateNameSpan) {
            const affiliateName = decodeURIComponent(affiliateParam).split('_').join(' ');
            affiliateSection.style.display = 'block';
            affiliateNameSpan.textContent = affiliateName;
        }
    }
}

/**
 * Setup state and LGA dropdowns
 */
function setupStateAndLGA() {
    const stateSelect = document.getElementById('state');
    const lgaSelect = document.getElementById('lga');
    
    if (stateSelect && lgaSelect && typeof nigeriaStatesLGAs !== 'undefined') {
        stateSelect.addEventListener('change', function() {
            const selectedState = this.value;
            
            // Clear LGA options
            lgaSelect.innerHTML = '<option value="">Select your LGA</option>';
            
            // If a state is selected, populate LGAs
            if (selectedState && nigeriaStatesLGAs[selectedState]) {
                nigeriaStatesLGAs[selectedState].forEach(lga => {
                    const option = document.createElement('option');
                    option.value = lga;
                    option.textContent = lga;
                    lgaSelect.appendChild(option);
                });
            }
        });
    }
}

/**
 * Handle payment form submission
 * @param {Event} e - Form submit event
 */
function handlePaymentSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Show loading state
    toggleLoadingState(true);
    
    // Get form data
    const formData = getFormData();
    
    // Store form data in session storage for the success page
    sessionStorage.setItem('paymentFormData', JSON.stringify(formData));
    
    try {
        // Initialize Paystack payment
        const handler = PaystackPop.setup({
            key: 'pk_test_3a9712dd9856f38b6b0875f553cba64a866422f6', // Replace with your Paystack public key
            email: formData.email,
            amount: parseFloat(formData.amount) * 100, // Convert to kobo
            currency: 'NGN',
            ref: generateReference(),
            metadata: {
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
                    },
                    {
                        display_name: "Affiliate",
                        variable_name: "affiliate",
                        value: formData.affiliate || 'None'
                    }
                ]
            },
            callback: function(response) {
                // Redirect to success page with reference
                window.location.href = `success.html?reference=${response.reference}`;
            },
            onClose: function() {
                // Reset button state
                toggleLoadingState(false);
                alert('Payment window closed. Please try again if you wish to complete your payment.');
            }
        });
        
        // Open Paystack payment modal
        handler.openIframe();
    } catch (error) {
        console.error('Paystack error:', error);
        showError('An error occurred while initializing payment. Please try again.');
        toggleLoadingState(false);
    }
}

/**
 * Generate a unique reference for the transaction
 * @returns {string} Unique reference
 */
function generateReference() {
    const prefix = 'ENS';
    const randomNum = Math.floor((Math.random() * 1000000000) + 1);
    const timestamp = new Date().getTime();
    return `${prefix}_${randomNum}_${timestamp}`;
}

/**
 * Get form data from the payment form
 * @returns {Object} Form data object
 */
function getFormData() {
    return {
        package: document.getElementById('packageInput')?.value || document.getElementById('packageName')?.textContent || 'Standard Package',
        amount: document.getElementById('amountInput')?.value || '5000',
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        state: document.getElementById('state').value,
        lga: document.getElementById('lga').value,
        affiliate: document.getElementById('affiliateInput')?.value || ''
    };
}

/**
 * Validate the payment form
 * @returns {boolean} True if form is valid, false otherwise
 */
function validateForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const state = document.getElementById('state').value;
    const lga = document.getElementById('lga').value;
    
    // Reset previous error messages
    clearErrors();
    
    // Validate full name
    if (fullName.length < 3) {
        showFieldError('fullName', 'Please enter your full name (at least 3 characters)');
        return false;
    }
    
    // Validate email
    if (!isValidEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        return false;
    }
    
    // Validate phone
    if (!isValidPhone(phone)) {
        showFieldError('phone', 'Please enter a valid phone number');
        return false;
    }
    
    // Validate state
    if (!state) {
        showFieldError('state', 'Please select your state');
        return false;
    }
    
    // Validate LGA
    if (!lga) {
        showFieldError('lga', 'Please select your LGA');
        return false;
    }
    
    return true;
}

/**
 * Check if email is valid
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Check if phone number is valid
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone is valid
 */
function isValidPhone(phone) {
    // Basic validation for Nigerian phone numbers
    const phoneRegex = /^(\+?234|0)[789]\d{9}$/;
    return phoneRegex.test(phone);
}

/**
 * Show error message for a specific field
 * @param {string} fieldId - ID of the field with error
 * @param {string} message - Error message to display
 */
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('error');
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        field.parentNode.appendChild(errorMessage);
        field.focus();
    }
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
 * Clear all error messages
 */
function clearErrors() {
    // Remove error class from all fields
    const fields = document.querySelectorAll('.form-group input, .form-group select');
    fields.forEach(field => field.classList.remove('error'));
    
    // Remove all error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(element => element.remove());
    
    // Hide error container
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        errorContainer.style.display = 'none';
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
