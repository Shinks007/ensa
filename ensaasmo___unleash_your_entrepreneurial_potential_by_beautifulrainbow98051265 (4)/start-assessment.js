document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('assessmentForm');
    // Update form submission logic
    form.querySelector('.continue-btn').addEventListener('click', function() {
        if (validatePage()) {
            // Store answers in session storage
            const answers = {};
            form.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
                answers[radio.name] = radio.value;
            });
            const existingAnswers = JSON.parse(sessionStorage.getItem('assessmentAnswers') || '{}');
            sessionStorage.setItem('assessmentAnswers', JSON.stringify({
                ...existingAnswers,
                ...answers
            }));

            // Get current page from URL or default to 1
            const currentPageMatch = window.location.pathname.match(/assessment-page-(\d+)/);
            const currentPage = currentPageMatch ? parseInt(currentPageMatch[1]) : 1;
            
            // Navigate to results page since this is the final page
            if (window.location.pathname.includes('assessment-page-4')) {
                window.location.href = 'assessment-results.html';
            } else if (currentPage < 4) { 
                window.location.href = `assessment-page-${currentPage + 1}.html`;
            }
        } else {
            // Show error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please answer all questions before continuing';
            
            const existingError = document.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            form.insertBefore(errorMsg, form.firstChild);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            setTimeout(() => {
                errorMsg.remove();
            }, 3000);
        }
    });

    function validatePage() {
        const currentQuestions = form.querySelectorAll('input[type="radio"]');
        let allAnswered = true;
        
        currentQuestions.forEach(question => {
            const name = question.getAttribute('name');
            if (!form.querySelector(`input[name="${name}"]:checked`)) {
                allAnswered = false;
            }
        });

        return allAnswered;
    }

    // Add animation to questions
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.question-block').forEach((block, index) => {
        block.style.opacity = '0';
        block.style.transform = 'translateY(20px)';
        block.style.transition = 'all 0.5s ease';
        block.style.transitionDelay = `${index * 100}ms`;
        observer.observe(block);
    });
});