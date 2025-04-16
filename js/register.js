document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        // Basic validation
        if (!fullName || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        
        // Name validation
        if (fullName.length < 3) {
            alert('Full name must be at least 3 characters long');
            return;
        }
        
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Password validation
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        
        // Password match validation
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // Terms validation
        if (!terms) {
            alert('Please agree to the Terms and Conditions');
            return;
        }
        
        // Here you would typically make an API call to your backend
        // For now, we'll just log the data and redirect
        console.log('Registration attempt with:', { 
            fullName, 
            email, 
            password 
        });
        
        // Simulate successful registration
        alert('Registration successful!');
        window.location.href = 'login.html';
    });
}); 