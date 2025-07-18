// Restaurant Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeMenuTabs();
    initializeForms();
    initializeScrollEffects();
    initializeAnimations();
    setMinDate();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Menu tabs functionality
function initializeMenuTabs() {
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuCategories = document.querySelectorAll('.menu-category');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all tabs and categories
            menuTabs.forEach(t => t.classList.remove('active'));
            menuCategories.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding category
            this.classList.add('active');
            document.getElementById(category).classList.add('active');
            
            // Animate menu items
            animateMenuItems(category);
        });
    });
}

// Animate menu items when category changes
function animateMenuItems(category) {
    const menuItems = document.querySelectorAll(`#${category} .menu-item`);
    
    menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Form handling
function initializeForms() {
    const reservationForm = document.getElementById('reservationForm');
    const contactForm = document.getElementById('contactForm');

    // Reservation form
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleReservationSubmit);
    }

    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Form validation
    addFormValidation();
}

// Handle reservation form submission
function handleReservationSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reservationData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        date: formData.get('date'),
        time: formData.get('time'),
        guests: formData.get('guests'),
        specialRequests: formData.get('specialRequests')
    };

    // Validate form
    if (!validateReservationForm(reservationData)) {
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="spinner"></span>Processing...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Show success message
        showSuccessModal('Reservation Confirmed!', 
            `Thank you ${reservationData.firstName}! Your reservation for ${reservationData.guests} guests on ${formatDate(reservationData.date)} at ${formatTime(reservationData.time)} has been confirmed. We'll send a confirmation email to ${reservationData.email}.`);
        
        // Reset form
        e.target.reset();
        
        // Track reservation (analytics)
        trackEvent('reservation_made', reservationData);
    }, 2000);
}

// Handle contact form submission
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // Validate form
    if (!validateContactForm(contactData)) {
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="spinner"></span>Sending...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Show success message
        showSuccessModal('Message Sent!', 
            `Thank you ${contactData.name}! Your message has been sent successfully. We'll get back to you at ${contactData.email} within 24 hours.`);
        
        // Reset form
        e.target.reset();
        
        // Track contact (analytics)
        trackEvent('contact_form_submitted', contactData);
    }, 1500);
}

// Form validation
function validateReservationForm(data) {
    const errors = [];
    
    if (!data.firstName.trim()) errors.push('First name is required');
    if (!data.lastName.trim()) errors.push('Last name is required');
    if (!data.email.trim() || !isValidEmail(data.email)) errors.push('Valid email is required');
    if (!data.phone.trim()) errors.push('Phone number is required');
    if (!data.date) errors.push('Date is required');
    if (!data.time) errors.push('Time is required');
    if (!data.guests) errors.push('Number of guests is required');
    
    // Check if date is in the future
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        errors.push('Please select a future date');
    }
    
    if (errors.length > 0) {
        showErrorMessage(errors.join('\n'));
        return false;
    }
    
    return true;
}

function validateContactForm(data) {
    const errors = [];
    
    if (!data.name.trim()) errors.push('Name is required');
    if (!data.email.trim() || !isValidEmail(data.email)) errors.push('Valid email is required');
    if (!data.subject.trim()) errors.push('Subject is required');
    if (!data.message.trim()) errors.push('Message is required');
    
    if (errors.length > 0) {
        showErrorMessage(errors.join('\n'));
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add real-time form validation
function addFormValidation() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    clearFieldError(field);
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} is required`;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (field.type === 'tel' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--accent-color)';
    errorElement.style.fontSize = '0.9rem';
    errorElement.style.marginTop = '0.5rem';
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function getFieldLabel(fieldName) {
    const labels = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        date: 'Date',
        time: 'Time',
        guests: 'Number of Guests',
        name: 'Name',
        subject: 'Subject',
        message: 'Message'
    };
    
    return labels[fieldName] || fieldName;
}

// Set minimum date for reservation
function setMinDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const minDate = tomorrow.toISOString().split('T')[0];
        dateInput.setAttribute('min', minDate);
    }
}

// Modal functionality
function showSuccessModal(title, message) {
    const modal = document.getElementById('successModal');
    const modalTitle = modal.querySelector('h3');
    const modalMessage = modal.querySelector('#modalMessage');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.style.display = 'block';
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
}

function showErrorMessage(message) {
    alert(message); // In a real app, you'd use a better error display
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.menu-item, .gallery-item, .stat, .contact-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

function initializeAnimations() {
    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        .menu-item, .gallery-item, .stat, .contact-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .error {
            border-color: var(--accent-color) !important;
            box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2) !important;
        }
    `;
    document.head.appendChild(style);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData) {
    console.log('Analytics Event:', eventName, eventData);
    // In a real application, you would send this to your analytics service
    // Example: gtag('event', eventName, eventData);
}

// Gallery lightbox functionality
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // In a real app, you would open a lightbox here
            console.log('Gallery item clicked');
        });
    });
}

// Restaurant hours checker
function checkRestaurantHours() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    
    let isOpen = false;
    let message = '';
    
    if (day >= 1 && day <= 4) { // Monday - Thursday
        isOpen = hour >= 17 && hour < 22; // 5 PM - 10 PM
        message = isOpen ? 'We are currently open!' : 'Closed - Open Mon-Thu: 5:00 PM - 10:00 PM';
    } else if (day === 5 || day === 6) { // Friday - Saturday
        isOpen = hour >= 17 && hour < 23; // 5 PM - 11 PM
        message = isOpen ? 'We are currently open!' : 'Closed - Open Fri-Sat: 5:00 PM - 11:00 PM';
    } else { // Sunday
        isOpen = hour >= 16 && hour < 21; // 4 PM - 9 PM
        message = isOpen ? 'We are currently open!' : 'Closed - Open Sun: 4:00 PM - 9:00 PM';
    }
    
    return { isOpen, message };
}

// Add restaurant hours indicator
function addHoursIndicator() {
    const { isOpen, message } = checkRestaurantHours();
    
    // Create hours indicator element
    const hoursIndicator = document.createElement('div');
    hoursIndicator.className = 'hours-indicator';
    hoursIndicator.innerHTML = `
        <span class="status-dot ${isOpen ? 'open' : 'closed'}"></span>
        <span class="status-text">${message}</span>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .hours-indicator {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--bg-white);
            padding: 1rem;
            border-radius: 10px;
            box-shadow: var(--shadow);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 1000;
            font-size: 0.9rem;
            font-weight: 600;
        }
        
        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
        }
        
        .status-dot.open {
            background: var(--success-green, #10b981);
        }
        
        .status-dot.closed {
            background: var(--accent-color);
        }
        
        @media (max-width: 768px) {
            .hours-indicator {
                bottom: 10px;
                right: 10px;
                font-size: 0.8rem;
                padding: 0.75rem;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(hoursIndicator);
    
    // Update every minute
    setInterval(() => {
        const { isOpen: newIsOpen, message: newMessage } = checkRestaurantHours();
        const statusDot = hoursIndicator.querySelector('.status-dot');
        const statusText = hoursIndicator.querySelector('.status-text');
        
        statusDot.className = `status-dot ${newIsOpen ? 'open' : 'closed'}`;
        statusText.textContent = newMessage;
    }, 60000);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    addHoursIndicator();
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Quick navigation with Alt + number keys
    if (e.altKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
                break;
            case '2':
                e.preventDefault();
                document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
                break;
            case '3':
                e.preventDefault();
                document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
                break;
            case '4':
                e.preventDefault();
                document.querySelector('#gallery').scrollIntoView({ behavior: 'smooth' });
                break;
            case '5':
                e.preventDefault();
                document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
                break;
        }
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

console.log('Flames Restaurant website initialized successfully! 🔥');
