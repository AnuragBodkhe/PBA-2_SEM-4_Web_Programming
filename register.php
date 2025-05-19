<?php
// Start session
session_start();

// Initialize variables
$error = "";
$success = "";
$fullName = "";
$email = "";
$username = "";

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $fullName = trim($_POST["fullName"]);
    $email = trim($_POST["email"]);
    $username = trim($_POST["username"]);
    $password = trim($_POST["password"]);
    $confirmPassword = trim($_POST["confirmPassword"]);
    $terms = isset($_POST["terms"]) ? true : false;
    
    // Validate input
    if (empty($fullName) || empty($email) || empty($username) || empty($password) || empty($confirmPassword)) {
        $error = "Please fill in all fields";
    } elseif (strlen($fullName) < 3) {
        $error = "Full name must be at least 3 characters long";
    } elseif (strlen($username) < 3) {
        $error = "Username must be at least 3 characters long";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address";
    } elseif (strlen($password) < 6) {
        $error = "Password must be at least 6 characters long";
    } elseif ($password !== $confirmPassword) {
        $error = "Passwords do not match";
    } elseif (!$terms) {
        $error = "Please agree to the Terms and Conditions";
    } else {
        // Create data directory if it doesn't exist
        if (!file_exists('data')) {
            mkdir('data', 0777, true);
        }
        
        // Load existing users
        $users = [];
        if (file_exists('data/users.json')) {
            $users_json = file_get_contents('data/users.json');
            if ($users_json) {
                $users = json_decode($users_json, true);
            }
        }
        
        // Check if username or email already exists
        $usernameExists = false;
        $emailExists = false;
        
        foreach ($users as $user) {
            if ($user['username'] === $username) {
                $usernameExists = true;
                break;
            }
            if ($user['email'] === $email) {
                $emailExists = true;
                break;
            }
        }
        
        if ($usernameExists) {
            $error = "Username already exists. Please choose another one.";
        } elseif ($emailExists) {
            $error = "Email already registered. Please use another email or login.";
        } else {
            // Create new user
            $newUser = [
                'fullName' => $fullName,
                'email' => $email,
                'username' => $username,
                'password' => $password // In a real app, you'd hash this password
            ];
            
            // Add to users array
            $users[] = $newUser;
            
            // Save to file
            $result = file_put_contents('data/users.json', json_encode($users));
            
            if ($result) {
                $success = "Registration successful! Redirecting to login page...";
                
                // Clear form data
                $fullName = "";
                $email = "";
                $username = "";
                
                // Redirect after a short delay (handled by JavaScript)
            } else {
                $error = "An error occurred during registration. Please try again.";
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - SHOPLANE</title>
    <link rel="stylesheet" href="css/register.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="icon" href="https://yt3.ggpht.com/a/AGF-l78km1YyNXmF0r3-0CycCA0HLA_i6zYn_8NZEg=s900-c-k-c0xffffffff-no-rj-mo" type="image/gif" sizes="16x16">
    <script src="https://kit.fontawesome.com/4a3b1f73a2.js"></script>
</head>
<body>
    <div class="container">
        <div class="register-container">
            <h2>Create Account</h2>
            <p class="subtitle">Join our fashion community</p>
            
            <?php if (!empty($error)): ?>
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i> <?php echo $error; ?>
            </div>
            <?php endif; ?>
            
            <?php if (!empty($success)): ?>
            <div class="success-message">
                <i class="fas fa-check-circle"></i> <?php echo $success; ?>
            </div>
            <?php endif; ?>
            
            <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" class="register-form">
                <div class="form-group">
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" name="fullName" value="<?php echo htmlspecialchars($fullName); ?>" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($email); ?>" required>
                </div>
                
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($username); ?>" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required>
                </div>
                
                <div class="form-group terms">
                    <input type="checkbox" id="terms" name="terms" required>
                    <label for="terms">I agree to the <a href="#">Terms and Conditions</a></label>
                </div>
                
                <button type="submit" class="register-btn">Create Account</button>
                
                <div class="form-footer">
                    <p>Already have an account? <a href="login.php">Login</a></p>
                </div>
            </form>
        </div>
    </div>
    
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
            
            // Redirect after successful registration
            const successMessage = document.querySelector('.success-message');
            if (successMessage) {
                setTimeout(function() {
                    window.location.href = 'login.php';
                }, 2000);
            }
        });
    </script>
</body>
</html>
