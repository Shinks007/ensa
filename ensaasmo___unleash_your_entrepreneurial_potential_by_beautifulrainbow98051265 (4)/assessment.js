document.addEventListener('DOMContentLoaded', function() {
    // Questions data - 62 questions total
    const questions = [
        // Page 1 - Sales & Marketing (14 questions)
        { id: 1, text: "Sales Planning", description: "Developing strategies to reach sales targets", category: "Sales & Marketing" },
        { id: 2, text: "Pricing", description: "Understanding how to set prices that maximize profits while remaining competitive", category: "Sales & Marketing" },
        { id: 3, text: "Negotiating", description: "Securing favorable terms and conditions in deals", category: "Sales & Marketing" },
        { id: 4, text: "Customer Service Follow-Up", description: "Maintaining relationships with customer's post-sale to ensure satisfaction and repeat business", category: "Sales & Marketing" },
        { id: 5, text: "Managing Other Sales Reps", description: "Leading and motivating a sales team to achieve targets", category: "Sales & Marketing" },
        { id: 6, text: "Tracking Competitors", description: "Staying informed about competitor activities to strategize accordingly", category: "Sales & Marketing" },
        { id: 7, text: "Buying", description: "Knowing how to procure goods and services at the best price and quality", category: "Sales & Marketing" },
        { id: 8, text: "Marketing Strategies", description: "Developing comprehensive plans to reach potential customers", category: "Sales & Marketing" },
        { id: 9, text: "Advertising/Promotion/Public Relations", description: "Creating awareness and interest in the product/service", category: "Sales & Marketing" },
        { id: 10, text: "Advertising Copywriting", description: "Crafting compelling messages to attract customers", category: "Sales & Marketing" },
        { id: 11, text: "Annual Marketing Plans", description: "Setting long-term marketing goals and strategies", category: "Sales & Marketing" },
        { id: 12, text: "Media Planning and Buying", description: "Allocating budget across various media channels effectively", category: "Sales & Marketing" },
        { id: 13, text: "Distribution Channel Planning", description: "Determining the best ways to get products to customers", category: "Sales & Marketing" },
        { id: 14, text: "Packaging", description: "Designing product packaging that attracts and informs customers", category: "Sales & Marketing" },

        // Page 2 - Financial & Operations (16 questions)
        { id: 15, text: "Cash Flow Planning", description: "Managing the inflow and outflow of money to ensure liquidity", category: "Financial" },
        { id: 16, text: "Management of Credit Lines", description: "Efficiently managing credit to support business operations", category: "Financial" },
        { id: 17, text: "Monthly Financial", description: "Regular financial review and reporting", category: "Financial" },
        { id: 18, text: "Bank Relationships", description: "Building and maintaining strong relationships with banks", category: "Financial" },
        { id: 19, text: "Bookkeeping", description: "Recording all financial transactions accurately", category: "Financial" },
        { id: 20, text: "Billing, Payables, Receivables", description: "Managing the company's cash flow related to billing and payments", category: "Financial" },
        { id: 21, text: "Monthly Profit and Loss Statements/Balance Sheets", description: "Preparing financial statements to track business performance", category: "Financial" },
        { id: 22, text: "Quarterly/Annual Tax Preparation", description: "Ensuring compliance with tax laws and regulations", category: "Financial" },
        { id: 23, text: "Innovative Thinking", description: "Creativity and innovation in business practices", category: "Innovation" },
        { id: 24, text: "Problem-Solving", description: "Identifying and solving problems effectively", category: "Innovation" },
        { id: 25, text: "Leadership", description: "Inspiring and guiding others", category: "Leadership" },
        { id: 26, text: "Adaptability", description: "Flexibility to change and new situations", category: "Personal" },
        { id: 27, text: "Customer Focus", description: "Prioritizing customer satisfaction and needs", category: "Customer" },
        { id: 28, text: "Strategic Thinking", description: "Long-term planning and vision", category: "Strategic" },
        { id: 29, text: "Resilience", description: "Overcoming challenges and bouncing back from difficulties", category: "Personal" },
        { id: 30, text: "Risk Management", description: "Identifying, assessing, and mitigating risks", category: "Strategic" },

        // Page 3 - Personal & Communication (16 questions)
        { id: 31, text: "Personal Skills", description: "Overall personal capabilities and attributes", category: "Personal" },
        { id: 32, text: "Ability to Work Long and Hard", description: "Dedication and perseverance", category: "Personal" },
        { id: 33, text: "Ability to Manage Risk and Stress", description: "Handling uncertainty and pressure well", category: "Personal" },
        { id: 34, text: "Ability to Deal with Failure", description: "Resilience in the face of setbacks", category: "Personal" },
        { id: 35, text: "Ability to Work Alone", description: "Independence and self-motivation", category: "Personal" },
        { id: 36, text: "Family Support", description: "Having a supportive personal life", category: "Personal" },
        { id: 37, text: "Stakeholder Communication", description: "Keeping all parties informed and aligned", category: "Communication" },
        { id: 38, text: "Oral Presentation Skills", description: "Effectively presenting ideas verbally", category: "Communication" },
        { id: 39, text: "Written Communication Skills", description: "Clear and concise written communication", category: "Communication" },
        { id: 40, text: "Ability to Work with and Manage Others", description: "Effective teamwork and leadership", category: "Leadership" },
        { id: 41, text: "Organizational Skills", description: "Keeping tasks and teams organized", category: "Personal" },
        { id: 42, text: "Computer Skills", description: "Proficiency with digital tools for collaboration", category: "Technical" },
        { id: 43, text: "Understanding Customer Needs", description: "Deep understanding of customer pain points and desires", category: "Customer" },
        { id: 44, text: "User Research", description: "Gathering qualitative and quantitative data about users", category: "Customer" },
        { id: 45, text: "Interviewing Skills", description: "Conducting effective interviews to gather insights", category: "Communication" },
        { id: 46, text: "Observation Skills", description: "Analyzing user behavior in their natural environment", category: "Customer" },

        // Page 4 - Innovation & Management (16 questions)
        { id: 47, text: "Creative Problem-Solving", description: "Developing innovative solutions", category: "Innovation" },
        { id: 48, text: "Brainstorming Techniques", description: "Generating creative ideas collaboratively", category: "Innovation" },
        { id: 49, text: "Concept Development", description: "Refining and selecting the best ideas", category: "Innovation" },
        { id: 50, text: "Rapid Prototyping", description: "Quickly creating models to test ideas", category: "Innovation" },
        { id: 51, text: "Mock-Up Creation", description: "Developing visual representations of products", category: "Innovation" },
        { id: 52, text: "Feedback Incorporation", description: "Iterating based on user and stakeholder feedback", category: "Innovation" },
        { id: 53, text: "User Testing", description: "Evaluating products with real users", category: "Customer" },
        { id: 54, text: "Usability Testing", description: "Ensuring products are easy to use", category: "Customer" },
        { id: 55, text: "Iterative Testing and Refinement", description: "Continuously improving products based on feedback", category: "Innovation" },
        { id: 56, text: "Motivating Employees", description: "Encouraging and inspiring employees to perform their best", category: "Leadership" },
        { id: 57, text: "Hiring Employees", description: "Recruiting the right talent", category: "Management" },
        { id: 58, text: "Firing Employees", description: "Handling terminations professionally and legally", category: "Management" },
        { id: 59, text: "General Management Skills", description: "Overall management and leadership capabilities", category: "Management" },
        { id: 60, text: "Scheduling", description: "Efficiently planning and organizing tasks and meetings", category: "Management" },
        { id: 61, text: "Payroll Handling", description: "Managing employee compensation", category: "Management" },
        { id: 62, text: "Benefits Administration", description: "Overseeing employee benefits programs", category: "Management" }
    ];

    // Group questions by category
    function groupQuestionsByCategory(questions) {
        const categories = {};

        // Group questions by their category
        questions.forEach(question => {
            if (!categories[question.category]) {
                categories[question.category] = [];
            }
            categories[question.category].push(question);
        });

        return categories;
    }

    // Shuffle questions within each category
    function shuffleQuestionsWithinCategories(questions) {
        // Group questions by category
        const categorizedQuestions = groupQuestionsByCategory(questions);

        // Shuffle each category separately
        Object.keys(categorizedQuestions).forEach(category => {
            // Fisher-Yates shuffle algorithm for this category
            const categoryQuestions = categorizedQuestions[category];
            for (let i = categoryQuestions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [categoryQuestions[i], categoryQuestions[j]] = [categoryQuestions[j], categoryQuestions[i]];
            }
        });

        // Flatten the categories back into a single array while preserving IDs
        const shuffledQuestions = [];
        Object.values(categorizedQuestions).forEach(categoryQuestions => {
            shuffledQuestions.push(...categoryQuestions);
        });

        // Sort by ID to maintain question numbers
        shuffledQuestions.sort((a, b) => a.id - b.id);

        return shuffledQuestions;
    }

    // Shuffle the questions within categories while preserving their IDs
    const shuffledQuestions = shuffleQuestionsWithinCategories(questions);

    // Set up exactly 4 pages with questions distributed evenly
    const totalPages = 4;
    const questionsPerPage = Math.ceil(shuffledQuestions.length / totalPages);
    let currentPage = 1;

    // Get the form element
    const form = document.getElementById('assessmentForm');
    if (!form) {
        console.error('Assessment form not found');
        return;
    }

    // Create pages container
    const pagesContainer = document.createElement('div');
    pagesContainer.className = 'pages-container';
    form.appendChild(pagesContainer);

    // Create pages with questions
    for (let page = 1; page <= totalPages; page++) {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'question-page';
        pageDiv.id = `page-${page}`;
        pageDiv.style.display = page === 1 ? 'block' : 'none';

        // Get questions for this page
        const startIdx = (page - 1) * questionsPerPage;
        const endIdx = Math.min(startIdx + questionsPerPage, shuffledQuestions.length);
        const pageQuestions = shuffledQuestions.slice(startIdx, endIdx);

        // Create question card
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';

        // Add questions to the card
        pageQuestions.forEach(question => {
            const questionBlock = createQuestionBlock(question);
            questionCard.appendChild(questionBlock);
        });

        pageDiv.appendChild(questionCard);

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'page-button-container';

        // Add continue button for all pages except the last
        if (page < totalPages) {
            const continueButton = document.createElement('button');
            continueButton.type = 'button';
            continueButton.className = 'continue-btn';
            continueButton.innerHTML = '<span>Continue</span> <i class="fas fa-arrow-right"></i>';
            continueButton.addEventListener('click', function() {
                if (validateCurrentPage(page)) {
                    // Add animation class to button
                    this.classList.add('clicked');

                    // Navigate after animation completes
                    setTimeout(() => {
                        navigateToPage(page + 1);
                        this.classList.remove('clicked');
                    }, 300);
                } else {
                    // Show a more elegant error message
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please answer all highlighted questions before continuing.';

                    // Add to page and remove after 3 seconds
                    pageDiv.insertBefore(errorMsg, buttonContainer);
                    setTimeout(() => {
                        errorMsg.remove();
                    }, 3000);
                }
            });
            buttonContainer.appendChild(continueButton);
        } else {
            // Add submit button to the last page
            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.className = 'submit-btn';
            submitButton.id = 'getResultsBtn';
            submitButton.innerHTML = '<span>Get Your Results</span> <i class="fas fa-chart-bar"></i>';
            buttonContainer.appendChild(submitButton);
        }

        pageDiv.appendChild(buttonContainer);
        pagesContainer.appendChild(pageDiv);
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please answer all questions before submitting.');
            return;
        }

        // Calculate and store results
        const results = calculateResults();
        sessionStorage.setItem('assessmentResults', JSON.stringify(results));

        // Redirect to results page
        window.location.href = 'assessment-results.html';
    });

    // Function to create a question block
    function createQuestionBlock(question) {
        const div = document.createElement('div');
        div.className = 'question-block';
        div.setAttribute('data-category', question.category); // Keep this for internal tracking
        div.innerHTML = `
            <h4 data-number="${question.id}">${question.text}</h4>
            <p>${question.description}</p>
            <div class="question-rating-scale">
                ${[1,2,3,4,5].map(value => `
                    <label>
                        <input type="radio" name="q${question.id}" value="${value}" required>
                        <span>${value}</span>
                    </label>
                `).join('')}
            </div>
        `;
        return div;
    }

    // Function to navigate between pages
    function navigateToPage(pageNum) {
        // Hide current page
        document.getElementById(`page-${currentPage}`).style.display = 'none';

        // Show selected page
        document.getElementById(`page-${pageNum}`).style.display = 'block';

        // Update current page
        currentPage = pageNum;

        // Scroll to top of the form
        form.scrollIntoView({ behavior: 'smooth' });
    }

    // Function to validate current page and highlight unanswered questions
    function validateCurrentPage(pageNum) {
        const startIdx = (pageNum - 1) * questionsPerPage + 1;
        const endIdx = Math.min(startIdx + questionsPerPage - 1, questions.length);
        let allAnswered = true;
        let firstUnanswered = null;

        // Remove any previous highlights
        document.querySelectorAll('.question-block').forEach(block => {
            block.classList.remove('unanswered');
        });

        // Check each question on the current page
        for (let i = startIdx; i <= endIdx; i++) {
            const questionBlock = form.querySelector(`input[name="q${i}"]`).closest('.question-block');
            if (!form.querySelector(`input[name="q${i}"]:checked`)) {
                questionBlock.classList.add('unanswered');

                // Add pulse animation to the rating scale
                const ratingScale = questionBlock.querySelector('.question-rating-scale');
                if (ratingScale) {
                    ratingScale.classList.add('highlight-required');
                    setTimeout(() => {
                        ratingScale.classList.remove('highlight-required');
                    }, 2000);
                }

                allAnswered = false;

                // Store the first unanswered question for scrolling
                if (!firstUnanswered) {
                    firstUnanswered = questionBlock;
                }
            }
        }

        // Scroll to the first unanswered question if any
        if (firstUnanswered) {
            setTimeout(() => {
                firstUnanswered.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }

        return allAnswered;
    }

    // Function to validate the entire form
    function validateForm() {
        let allAnswered = true;
        let firstUnansweredPage = null;
        let firstUnansweredQuestion = null;

        // Remove any previous highlights
        document.querySelectorAll('.question-block').forEach(block => {
            block.classList.remove('unanswered');
        });

        for (let i = 1; i <= questions.length; i++) {
            const questionBlock = form.querySelector(`input[name="q${i}"]`).closest('.question-block');
            if (!form.querySelector(`input[name="q${i}"]:checked`)) {
                // Highlight unanswered question
                questionBlock.classList.add('unanswered');

                // Add pulse animation to the rating scale
                const ratingScale = questionBlock.querySelector('.question-rating-scale');
                if (ratingScale) {
                    ratingScale.classList.add('highlight-required');
                    setTimeout(() => {
                        ratingScale.classList.remove('highlight-required');
                    }, 2000);
                }

                allAnswered = false;

                // Find which page this question is on
                const pageNum = Math.ceil(i / questionsPerPage);

                // Store the first unanswered page and question
                if (!firstUnansweredPage) {
                    firstUnansweredPage = pageNum;
                    firstUnansweredQuestion = questionBlock;
                }
            }
        }

        // If there are unanswered questions, navigate to the first page with unanswered questions
        if (!allAnswered && firstUnansweredPage) {
            // Navigate to that page
            if (currentPage !== firstUnansweredPage) {
                navigateToPage(firstUnansweredPage);
            }

            // Scroll to the first unanswered question
            setTimeout(() => {
                firstUnansweredQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);

            // Show error message
            const pageDiv = document.getElementById(`page-${firstUnansweredPage}`);
            const buttonContainer = pageDiv.querySelector('.page-button-container');
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please answer all highlighted questions before submitting.';
            pageDiv.insertBefore(errorMsg, buttonContainer);
            setTimeout(() => {
                errorMsg.remove();
            }, 3000);
        }

        return allAnswered;
    }

    // Function to calculate results
    function calculateResults() {
        // Define assessment categories based on the scoring guide
        const categories = {
            "Sales & Marketing Skills": {
                questions: Array.from({length: 14}, (_, i) => i + 1),
                thresholds: {
                    low: 28,
                    medium: 49
                },
                feedback: {
                    low: "Lack of sales and marketing skills",
                    medium: "On the verge of being ready, but needs improvement",
                    high: "Possesses sales and marketing skills, but needs to stay up-to-date"
                }
            },
            "Financial Skills": {
                questions: Array.from({length: 8}, (_, i) => i + 15),
                thresholds: {
                    low: 16,
                    medium: 28
                },
                feedback: {
                    low: "Lack of financial skills",
                    medium: "On the verge of attaining financial skills",
                    high: "Possesses financial skills, but needs to stay up-to-date"
                }
            },
            "Intangible Skills": {
                questions: Array.from({length: 8}, (_, i) => i + 23),
                thresholds: {
                    low: 16,
                    medium: 28
                },
                feedback: {
                    low: "Lack of intangible skills",
                    medium: "On the verge of attaining intangible skills",
                    high: "Possesses intangible skills, but needs to stay up-to-date"
                }
            },
            "Personal Skills": {
                questions: Array.from({length: 6}, (_, i) => i + 31),
                thresholds: {
                    low: 12,
                    medium: 21
                },
                feedback: {
                    low: "Lack of personal skills",
                    medium: "On the verge of attaining personal skills",
                    high: "Possesses personal skills"
                }
            },
            "Communication & Collaboration Skills": {
                questions: Array.from({length: 6}, (_, i) => i + 37),
                thresholds: {
                    low: 12,
                    medium: 21
                },
                feedback: {
                    low: "Lack of communication and collaboration skills",
                    medium: "On the verge of attaining communication and collaboration skills",
                    high: "Possesses communication and collaboration skills, but needs to stay up-to-date"
                }
            },
            "Design Thinking Skills": {
                questions: Array.from({length: 13}, (_, i) => i + 43),
                thresholds: {
                    low: 26,
                    medium: 45
                },
                feedback: {
                    low: "Lack of design thinking skills",
                    medium: "On the verge of attaining design thinking skills",
                    high: "Possesses design thinking skills, but needs to stay up-to-date"
                }
            },
            "Administrative & Operational Skills": {
                questions: Array.from({length: 7}, (_, i) => i + 56),
                thresholds: {
                    low: 14,
                    medium: 24
                },
                feedback: {
                    low: "Lack of administrative and operational skills",
                    medium: "On the verge of attaining administrative and operational skills",
                    high: "Possesses administrative and operational skills, but needs to stay up-to-date"
                }
            }
        };

        // Calculate scores for each category
        const results = {
            categories: Object.entries(categories).map(([name, data]) => {
                let categoryScore = 0;
                const maxPossible = data.questions.length * 5;

                data.questions.forEach(questionId => {
                    const answer = parseInt(form.querySelector(`input[name="q${questionId}"]:checked`).value);
                    categoryScore += answer;
                });

                // Determine assessment level based on thresholds
                let assessment;
                if (categoryScore < data.thresholds.low) {
                    assessment = data.feedback.low;
                } else if (categoryScore < data.thresholds.medium) {
                    assessment = data.feedback.medium;
                } else {
                    assessment = data.feedback.high;
                }

                return {
                    name: name,
                    score: categoryScore,
                    maxScore: maxPossible,
                    percentage: (categoryScore / maxPossible) * 100,
                    assessment: assessment,
                    thresholds: data.thresholds
                };
            }),
            totalScore: 0,
            maxPossibleScore: shuffledQuestions.length * 5
        };

        // Calculate total score
        results.categories.forEach(category => {
            results.totalScore += category.score;
        });

        results.percentage = (results.totalScore / results.maxPossibleScore) * 100;

        // Add overall assessment based on total score
        if (results.totalScore < 124) {
            results.overallAssessment = "Reconsider whether owning a business is the right step";
        } else if (results.totalScore < 217) {
            results.overallAssessment = "On the verge of being ready, but needs improvement in weaker areas";
        } else {
            results.overallAssessment = "Ready to start a new business";
        }

        return results;
    }
});
