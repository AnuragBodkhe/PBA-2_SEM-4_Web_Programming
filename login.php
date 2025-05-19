<?php
// Start session
session_start();

// Initialize variables
$error = "";
$username = "";

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $username = trim($_POST["username"]);
    $password = trim($_POST["password"]);
    $remember = isset($_POST["remember"]) ? true : false;
    
    // Validate input
    if (empty($username) || empty($password)) {
        $error = "Please enter both username and password";
    } else {
        // In a real application, you would check against a database
        // For now, we'll use the same localStorage approach but through PHP
        $users_json = file_get_contents('data/users.json');
        
        // Check if the file exists and has content
        if ($users_json) {
            $users = json_decode($users_json, true);
            
            // Find user by username and password
            $user_found = false;
            foreach ($users as $user) {
                if ($user['username'] === $username && $user['password'] === $password) {
                    $user_found = true;
                    
                    // Create session variables
                    $_SESSION['isLoggedIn'] = true;
                    $_SESSION['user'] = [
                        'fullName' => $user['fullName'],
                        'email' => $user['email'],
                        'username' => $user['username']
                    ];
                    
                    // Set cookies if remember me is checked
                    if ($remember) {
                        setcookie('username', $username, time() + (86400 * 30), "/"); // 30 days
                    }
                    
                    // Redirect to index page
                    header("Location: index.html#no-redirect");
                    exit();
                }
            }
            
            if (!$user_found) {
                $error = "Invalid username or password";
            }
        } else {
            $error = "User database not found";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Login | SHOPLANE</title>
    
    <!-- Favicon -->
    <link rel="icon" href="https://yt3.ggpht.com/a/AGF-l78km1YyNXmF0r3-0CycCA0HLA_i6zYn_8NZEg=s900-c-k-c0xffffffff-no-rj-mo" type="image/gif" sizes="16x16">
    
    <!-- CSS -->
    <link rel="stylesheet" href="css/login.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <script src="https://kit.fontawesome.com/4a3b1f73a2.js"></script>
</head>
<body>
    <!-- Navbar removed as requested -->
    
    <div class="login-container">
        <div class="login-box">
            <div class="login-header">
                <h2>Welcome Back</h2>
                <p class="subtitle">Login to your account</p>
            </div>
            
            <?php if (!empty($error)): ?>
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i> <?php echo $error; ?>
            </div>
            <?php endif; ?>
            
            <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" class="login-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <div class="input-field">
                        <i class="fas fa-user"></i>
                        <input type="text" id="username" name="username" placeholder="Enter your username" value="<?php echo htmlspecialchars($username); ?>" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <div class="input-field">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="password" name="password" placeholder="Enter your password" required>
                    </div>
                </div>
                
                <div class="form-options">
                    <div class="remember-me">
                        <input type="checkbox" id="remember" name="remember">
                        <label for="remember">Remember me</label>
                    </div>
                    <a href="#" class="forgot-password">Forgot Password?</a>
                </div>
                
                <button type="submit" class="login-btn">Login <i class="fas fa-arrow-right"></i></button>
            </form>
            
            <div class="register-link">
                <p>Don't have an account? <a href="register.php">Register</a></p>
            </div>
        </div>
    </div>

    <!-- JavaScript for client-side validation -->
    <script>
        // Auto-hide error message after 5 seconds
        document.addEventListener('DOMContentLoaded', function() {
            const errorMessage = document.querySelector('.error-message');
            if (errorMessage) {
                setTimeout(function() {
                    errorMessage.style.opacity = '0';
                    setTimeout(function() {
                        errorMessage.remove();
                    }, 300);
                }, 5000);
            }
        });
    </script>
</body>
</html>
