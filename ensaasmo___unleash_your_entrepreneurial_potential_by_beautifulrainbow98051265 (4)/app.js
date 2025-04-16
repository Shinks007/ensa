// Mobile menu functionality
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const body = document.body;

// Toggle mobile menu
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    body.classList.toggle('menu-open');
}

// Close mobile menu
function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    body.classList.remove('menu-open');
}

// Event listeners
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
  document.body.classList.toggle('menu-open');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMobileMenu();
    }
});

// Close menu when clicking a link
document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

// Initialize title gradients
function createGradientElements() {
    const titles = document.querySelectorAll('.holographic-fx, .ensaasmo-gradient');
    
    titles.forEach(title => {
        const gradient = document.createElement('div');
        gradient.className = 'title-gradient';
        gradient.style.background = getComputedStyle(title).backgroundImage;
        gradient.style.animation = `hologram 5s linear infinite`;
        title.parentNode.insertBefore(gradient, title);
    });
}

// Function to handle slider animation
function initializeSlider() {
    const slides = document.querySelectorAll('.slide');
    if (!slides || slides.length === 0) return; // Guard clause
    
    let currentIndex = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.style.opacity = '1';
                slide.style.transform = 'translateY(0)';
            } else {
                slide.style.opacity = '0';
                slide.style.transform = 'translateY(20px)';
            }
        });
    }
    
    // Show first slide initially
    showSlide(0);
    
    // Add hover pause functionality
    const sliderContainer = document.querySelector('.title-container');
    if (!sliderContainer) return; // Guard clause
    
    let isPaused = false;
    
    sliderContainer.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        isPaused = false;
    });
    
    // Automatic slide progression
    setInterval(() => {
        if (!isPaused) {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: [0.1, 0.9]
};

function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    const elementTop = entry.target.getBoundingClientRect().top;
    const scrollingDown = elementTop < 0;
    
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      if (entry.target.classList.contains('stagger-in')) {
        const children = entry.target.querySelectorAll(':scope > *');
        if (scrollingDown) {
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('visible');
            }, index * 100);
          });
        } else {
          Array.from(children).reverse().forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('visible');
            }, index * 100);
          });
        }
      }
    } else {
      if ((scrollingDown && elementTop > window.innerHeight) || 
          (!scrollingDown && elementTop < 0)) {
        entry.target.classList.remove('visible');
        
        if (entry.target.classList.contains('stagger-in')) {
          const children = entry.target.querySelectorAll(':scope > *');
          if (scrollingDown) {
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.remove('visible');
              }, index * 100);
            });
          } else {
            Array.from(children).reverse().forEach((child, index) => {
              setTimeout(() => {
                child.classList.remove('visible');
              }, index * 100);
            });
          }
        }
      }
    }
  });
}

const observer = new IntersectionObserver(handleIntersection, observerOptions);

// Observe all animated elements
function initializeAnimations() {
  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-in').forEach(element => {
    observer.observe(element);
  });
}

// Add smooth parallax effect to hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  const speed = 0.5;
  
  hero.style.backgroundPosition = `center ${scrolled * speed}px`;
});

// Add hover effect to skill categories
document.querySelectorAll('.skill-category').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// Add loading animation
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Add this new function for step card animations
function initializeStepCards() {
    const stepCards = document.querySelectorAll('.step-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, {
      threshold: 0.2
    });

    stepCards.forEach((card, index) => {
      // Add staggered animation delay
      card.style.transitionDelay = `${index * 200}ms`;
      observer.observe(card);
    });
}

document.addEventListener('DOMContentLoaded', function() {
  // Add progress indicator
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-indicator';
  document.body.appendChild(progressBar);

  function updateProgress() {
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrolled / max) * 100;
    progressBar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', updateProgress);

  // Enhanced scroll-to-top functionality
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-top';
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(scrollTopBtn);

  let lastScrollTop = 0;
  window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Show button after scrolling down 500px
      if (scrollTop > 500) {
          scrollTopBtn.classList.add('visible');
          
          // Change icon based on scroll direction
          if (scrollTop > lastScrollTop) {
              scrollTopBtn.innerHTML = '<i class="fas fa-arrow-down"></i>';
          } else {
              scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
          }
      } else {
          scrollTopBtn.classList.remove('visible');
      }
      
      lastScrollTop = scrollTop;
  });

  scrollTopBtn.addEventListener('click', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const isScrollingDown = scrollTopBtn.querySelector('.fa-arrow-down');
      
      if (isScrollingDown) {
          window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: 'smooth'
          });
      } else {
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
      }
  });

  // Add section visibility transitions
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('section').forEach(section => {
    section.classList.add('section-transition');
    observer.observe(section);
  });

  // Add loading states to forms
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      form.classList.add('loading');
      // Remove loading class after form submission (adjust timing as needed)
      setTimeout(() => {
        form.classList.remove('loading');
      }, 2000);
    });
  });

  // Add hover effects to interactive elements
  document.querySelectorAll('button, .nav-links a, .card').forEach(element => {
    element.classList.add('hover-scale');
  });

  // Add tooltips to important buttons
  document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', (e) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = e.target.dataset.tooltip;
      document.body.appendChild(tooltip);
      
      const rect = e.target.getBoundingClientRect();
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
      tooltip.style.left = `${rect.left + (rect.width/2) - (tooltip.offsetWidth/2)}px`;
    });
    
    element.addEventListener('mouseleave', () => {
      document.querySelector('.tooltip')?.remove();
    });
  });

  try {
    initializeSlider(); // Initialize slider with error handling
    initializeAnimations();
    initializeStepCards();
    createGradientElements();
  } catch (error) {
    console.warn('Initialization error:', error);
  }
});

// Add cursor trail effect
const cursor = document.createElement('div');
cursor.classList.add('cursor-trail');
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.classList.add('scroll-progress');
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scroll = window.pageYOffset;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scroll / height) * 100;
  
  progressBar.style.width = `${progress}%`;
});

// Add smooth scroll to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});