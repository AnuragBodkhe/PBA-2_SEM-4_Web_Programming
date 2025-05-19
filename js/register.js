document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        // Basic validation
        if (!fullName || !email || !username || !password || !confirmPassword) {
            showError('Please fill in all fields');
            return;
        }
        
        // Name validation
        if (fullName.length < 3) {
            showError('Full name must be at least 3 characters long');
            return;
        }
        
        // Username validation
        if (username.length < 3) {
            showError('Username must be at least 3 characters long');
            return;
        }
        
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        // Password validation
        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            return;
        }
        
        // Password match validation
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }
        
        // Terms validation
        if (!terms) {
            showError('Please agree to the Terms and Conditions');
            return;
        }
        
        // Get existing users or create empty array
        let users = [];
        try {
            const existingUsers = localStorage.getItem('shopLaneUsers');
            if (existingUsers) {
                users = JSON.parse(existingUsers);
            }
        } catch (error) {
            console.error('Error loading existing users:', error);
        }
        
        // Check if username or email already exists
        const usernameExists = users.some(user => user.username === username);
        const emailExists = users.some(user => user.email === email);
        
        if (usernameExists) {
            showError('Username already exists. Please choose another one.');
            return;
        }
        
        if (emailExists) {
            showError('Email already registered. Please use another email or login.');
            return;
        }
        
        // Create new user object
        const newUser = {
            fullName,
            email,
            username,
            password
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save to localStorage
        try {
            localStorage.setItem('shopLaneUsers', JSON.stringify(users));
            showSuccess('Registration successful!');
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } catch (error) {
            console.error('Error saving user data:', error);
            showError('An error occurred during registration. Please try again.');
        }
    });
    
    function showError(message) {
        // Remove any existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message element
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // Insert after form
        const form = document.getElementById('registerForm');
        form.parentNode.insertBefore(errorMessage, form.nextSibling);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorMessage.style.opacity = '0';
            setTimeout(() => {
                errorMessage.remove();
            }, 300);
        }, 5000);
    }
    
    function showSuccess(message) {
        // Remove any existing messages
        const existingMessage = document.querySelector('.success-message, .error-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        // Insert after form
        const form = document.getElementById('registerForm');
        form.parentNode.insertBefore(successMessage, form.nextSibling);
    }
});