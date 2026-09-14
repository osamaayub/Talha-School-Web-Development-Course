// Form validation for signup page
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('.auth-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous error states
            clearErrors();
            
            // Get form values
            const fullName = document.getElementById('fullName');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');
            
            let isValid = true;
            
            // Validate full name
            if (fullName && !fullName.value.trim()) {
                showError(fullName, 'Full name is required');
                isValid = false;
            } else if (fullName && fullName.value.trim().length < 2) {
                showError(fullName, 'Full name must be at least 2 characters');
                isValid = false;
            }
            
            // Validate email
            if (!email.value.trim()) {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value.trim())) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate password
            if (!password.value) {
                showError(password, 'Password is required');
                isValid = false;
            } else if (password.value.length < 6) {
                showError(password, 'Password must be at least 6 characters');
                isValid = false;
            }
            
            // Validate confirm password
            if (confirmPassword && !confirmPassword.value) {
                showError(confirmPassword, 'Please confirm your password');
                isValid = false;
            } else if (confirmPassword && password.value !== confirmPassword.value) {
                showError(confirmPassword, 'Passwords do not match');
                isValid = false;
            }
            
            // If form is valid, you can submit it
            if (isValid) {
                console.log('Form is valid! Ready to submit.');
                console.log('Email:', email.value);
                console.log('Password:', password.value);
                
                if (fullName) {
                    console.log('Full Name:', fullName.value);
                }
                
                // Here you would typically send the data to a server
                // signupForm.submit();
                
                // For demo purposes, show success message
                alert('Form submitted successfully! (Demo)');
                signupForm.reset();
            }
        });
        
        // Real-time validation for password matching
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (password && confirmPassword) {
            confirmPassword.addEventListener('input', function() {
                if (confirmPassword.value && password.value !== confirmPassword.value) {
                    showError(confirmPassword, 'Passwords do not match');
                } else if (confirmPassword.value) {
                    clearFieldError(confirmPassword);
                }
            });
            
            password.addEventListener('input', function() {
                if (confirmPassword.value && password.value !== confirmPassword.value) {
                    showError(confirmPassword, 'Passwords do not match');
                } else if (confirmPassword.value) {
                    clearFieldError(confirmPassword);
                }
            });
        }
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error message for a field
function showError(field, message) {
    const formGroup = field.closest('.form-group');
    
    // Remove existing error if any
    clearFieldError(field);
    
    // Add error class to input
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Append error message to form-group
    formGroup.appendChild(errorElement);
}

// Clear error for a specific field
function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    field.classList.remove('error');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Clear all errors
function clearErrors() {
    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(input => {
        clearFieldError(input);
    });
    
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => {
        message.remove();
    });
}