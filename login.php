<?php
session_start();

$error = '';
$success = '';

// Check if user is already logged in
if (isset($_SESSION['user_id'])) {
    header("Location: index.html");
    exit();
}

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    // Validate input
    if (empty($email) || empty($password)) {
        $error = "Please fill in all fields";
    } else {
        // Check if users array exists in session
        if (isset($_SESSION['users']) && isset($_SESSION['users'][$email])) {
            $user = $_SESSION['users'][$email];
            
            // Verify password
            if ($password === $user['password']) {
                // Set session variables
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['name'];
                $_SESSION['user_email'] = $user['email'];

                // Redirect to home page
                header("Location: index.html");
                exit();
            } else {
                $error = "Invalid password";
            }
        } else {
            $error = "Email not found";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Fashion Store</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .auth-container {
            max-width: 400px;
            margin: 50px auto;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .form-group input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        .btn-primary {
            width: 100%;
            padding: 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
        }
        .btn-primary:hover {
            background: #0056b3;
        }
        .error-message {
            color: #dc3545;
            padding: 10px;
            margin-bottom: 20px;
            background: #ffe6e6;
            border-radius: 4px;
        }
        .success-message {
            color: #28a745;
            padding: 10px;
            margin-bottom: 20px;
            background: #e6ffe6;
            border-radius: 4px;
        }
        .auth-links {
            text-align: center;
            margin-top: 20px;
        }
        .auth-links a {
            color: #007bff;
            text-decoration: none;
        }
        .auth-links a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <?php include 'header.php'; ?>

    <div class="auth-container">
        <h1>Login</h1>
        
        <?php if ($error): ?>
            <div class="error-message"><?php echo $error; ?></div>
        <?php endif; ?>

        <form action="login.php" method="POST">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="btn-primary">Login</button>
        </form>
        
        <p class="auth-links">
            Don't have an account? <a href="register.php">Register here</a>
        </p>

        <!-- Default login credentials for testing -->
        <div style="margin-top: 20px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
                <strong>Test Account:</strong><br>
                Email: test@example.com<br>
                Password: password123
            </p>
        </div>
    </div>

    <?php include 'footer.php'; ?>
</body>
</html> 