document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Basic validation
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // Test credentials check
        if (email === '123' && password === '123') {
            alert('Login successful!');
            window.location.href = 'index.html';
            return;
        }
        
        // Here you would typically make an API call to your backend
        // For now, we'll just log the data and show error
        console.log('Login attempt with:', { email, password });
        alert('Invalid credentials. For testing, use username: 123 and password: 123');
    });
}); 