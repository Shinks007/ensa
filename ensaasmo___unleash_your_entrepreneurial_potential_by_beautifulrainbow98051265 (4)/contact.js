document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        experience: document.getElementById('experience').value.trim(),
        promotion: document.getElementById('promotion').value.trim()
    };
    
    // Generate affiliate URL
    const baseUrl = window.location.origin;
    const cleanName = formData.fullName.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '_');
    const affiliateUrl = `${baseUrl}/assessment.html?ref=${encodeURIComponent(cleanName)}`;
    
    // Show success message with affiliate URL
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <div class="success-content">
            <p>Thank you for your application! Our team will contact you within 24 hours.</p>
            <div class="affiliate-url-container">
                <p>Your Affiliate URL:</p>
                <div class="url-display">
                    <input type="text" value="${affiliateUrl}" readonly>
                    <button onclick="copyUrl(this)" class="copy-btn">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Remove any existing messages
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Insert success message
    const contactForm = document.getElementById('contactForm');
    contactForm.insertBefore(successDiv, contactForm.firstChild);
    
    // Reset form
    contactForm.reset();
};

// Add copy function
window.copyUrl = function(button) {
    const input = button.parentElement.querySelector('input');
    input.select();
    document.execCommand('copy');
    
    // Show copied feedback
    const icon = button.querySelector('i');
    icon.className = 'fas fa-check';
    button.classList.add('copied');
    
    setTimeout(() => {
        icon.className = 'fas fa-copy';
        button.classList.remove('copied');
    }, 2000);
};