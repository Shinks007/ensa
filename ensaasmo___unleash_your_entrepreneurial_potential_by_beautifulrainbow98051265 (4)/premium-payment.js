document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Get affiliate info from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const affiliateParam = urlParams.get('ref');

    if (affiliateParam) {
        // Decode and split the affiliate parameter
        const decodedParam = decodeURIComponent(affiliateParam);
        const affiliateName = decodedParam.split('_').join(' ');

        // Show affiliate section and update name
        const affiliateSection = document.querySelector('.affiliate-section');
        const affiliateNameSpan = document.getElementById('affiliateName');

        if (affiliateSection && affiliateNameSpan) {
            affiliateSection.style.display = 'block';
            affiliateNameSpan.textContent = affiliateName;
        }
    }

    // Add to existing form data when storing/submitting
    const storeFormData = (formData) => {
        formData.affiliate = affiliateParam || '';
        return formData;
    };

    // Valid Nigerian states
    const validStates = [
        "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
        "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
        "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
        "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
        "Yobe", "Zamfara"
    ];

    // LGA data for Nigerian states
    const lgaData = {
        "Abia": ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"],
        "Adamawa": ["Demsa", "Fufure", "Ganye", "Gayuk", "Gombi", "Grie", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
        "Akwa Ibom": ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono-Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat-Enin", "Nsit-Atai", "Nsit-Ibom", "Nsit-Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung-Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo"],
        "Lagos": ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"]
        // Add other states and their LGAs as needed
    };

    // Get package details from URL parameters
    const packageParam = urlParams.get('package');
    const amount = urlParams.get('amount');

    // Update package details in the UI and hidden fields
    document.getElementById('packageName').textContent = packageParam || 'Foundation Package';
    document.getElementById('packagePrice').textContent = amount ? `₦${Number(amount).toLocaleString()}` : '₦5,000';
    document.getElementById('packageInput').value = packageParam || 'Foundation Package';
    document.getElementById('amountInput').value = amount || '5000';

    // Set affiliate value if present
    if (affiliateParam) {
        document.getElementById('affiliateInput').value = affiliateParam;
    }

    const paymentForm = document.getElementById('paymentForm');
    const paymentButton = document.getElementById('paymentButton');
    const tokenButton = document.getElementById('tokenButton');
    const stateInput = document.getElementById('state');
    const lgaInput = document.getElementById('lga');

    // Populate state dropdown
    validStates.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateInput.appendChild(option);
    });

    // State dropdown change event
    stateInput.addEventListener('change', function() {
        // Clear existing LGA options
        lgaInput.innerHTML = '<option value="" disabled selected>Select your LGA</option>';

        const selectedState = this.value;

        if (selectedState && lgaData[selectedState]) {
            // Enable LGA dropdown
            lgaInput.disabled = false;

            // Populate LGA dropdown based on selected state
            lgaData[selectedState].forEach(lga => {
                const option = document.createElement('option');
                option.value = lga;
                option.textContent = lga;
                lgaInput.appendChild(option);
            });
        } else {
            // Disable LGA dropdown if no state is selected
            lgaInput.disabled = true;
        }

        validateForm();
    });

    // LGA dropdown change event
    lgaInput.addEventListener('change', function() {
        validateForm();
    });

    // Function to validate form
    function validateForm() {
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const state = document.getElementById('state').value;
        const lga = document.getElementById('lga').value;
        const phone = document.getElementById('phone').value.trim();

        // Validate name (minimum 3 characters)
        const isValidName = fullName.length >= 3;

        // Validate email (must be valid email format)
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        // Validate state (must be in valid states list)
        const isValidState = validStates.includes(state);

        // Validate LGA (must be at least 3 characters)
        const isValidLGA = lga.length >= 3;

        // Validate phone (must be valid phone format)
        const isValidPhone = /^\+?[\d\s-]{10,}$/.test(phone);

        const isValid = isValidName && isValidEmail && isValidState && isValidLGA && isValidPhone;

        // Update button states with animation
        if (isValid) {
            if (!paymentButton.classList.contains('active')) {
                // Add active class with animation
                paymentButton.classList.add('active');
                tokenButton.classList.add('active');
            }
        } else {
            paymentButton.classList.remove('active');
            tokenButton.classList.remove('active');
        }

        return isValid;
    }

    // Add event listeners to all form fields
    const formFields = ['fullName', 'email', 'state', 'lga', 'phone'];
    formFields.forEach(fieldId => {
        document.getElementById(fieldId).addEventListener('input', validateForm);
    });

    // Function to open Paystack payment modal
    function openPaystackModal() {
        if (!validateForm()) {
            alert('Please fill in all required fields correctly');
            return;
        }

        // Store form data before submission
        const formData = {
            package: document.getElementById('packageInput').value,
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            state: document.getElementById('state').value,
            lga: document.getElementById('lga').value,
            phone: document.getElementById('phone').value,
            amount: document.getElementById('amountInput').value,
            affiliate: document.getElementById('affiliateInput').value
        };

        const storedFormData = storeFormData(formData);
        sessionStorage.setItem('paymentFormData', JSON.stringify(storedFormData));

        // Show loading state on button
        const originalButtonText = paymentButton.innerHTML;
        paymentButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        paymentButton.disabled = true;
        paymentButton.classList.add('loading');

        // Direct Paystack integration
        const handler = PaystackPop.setup({
            key: 'pk_test_3a9712dd9856f38b6b0875f553cba64a866422f6', // Paystack test public key
            email: document.getElementById('email').value,
            amount: parseFloat(document.getElementById('amountInput').value) * 100, // Convert to kobo
            currency: 'NGN',
            ref: 'ENS'+Math.floor((Math.random() * 1000000000) + 1),
            metadata: {
                custom_fields: [
                    {
                        display_name: "Full Name",
                        variable_name: "full_name",
                        value: document.getElementById('fullName').value
                    },
                    {
                        display_name: "State",
                        variable_name: "state",
                        value: document.getElementById('state').value
                    },
                    {
                        display_name: "LGA",
                        variable_name: "lga",
                        value: document.getElementById('lga').value
                    },
                    {
                        display_name: "Phone",
                        variable_name: "phone",
                        value: document.getElementById('phone').value
                    },
                    {
                        display_name: "Package",
                        variable_name: "package",
                        value: document.getElementById('packageInput').value
                    },
                    {
                        display_name: "Affiliate",
                        variable_name: "affiliate",
                        value: document.getElementById('affiliateInput').value || 'None'
                    }
                ]
            },
            callback: function(response) {
                // Redirect to success page with reference
                window.location.href = `success.html?reference=${response.reference}`;
            },
            onClose: function() {
                // Reset button state
                paymentButton.innerHTML = originalButtonText;
                paymentButton.disabled = false;
                paymentButton.classList.remove('loading');
                alert('Payment window closed. Please try again if you wish to complete your payment.');
            }
        });

        // Open Paystack payment modal
        handler.openIframe();
    }

    // Form submission handler
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        openPaystackModal();
    });

    // Add direct click handler to payment button
    paymentButton.addEventListener('click', function(e) {
        if (!paymentForm.checkValidity()) {
            // If the form is invalid, let the form submission handle it
            return;
        }
        e.preventDefault();
        openPaystackModal();
    });

    // No longer using server-side initialization

    // Add token button handler
    tokenButton.addEventListener('click', function() {
        showTokenModal();
    });

    // Token modal functionality
    function showTokenModal() {
        // Token modal code from your original payment.js
        alert('Token functionality will be implemented in the next phase.');
    }
});
