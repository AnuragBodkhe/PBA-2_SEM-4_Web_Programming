<?php
session_start();

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // Validate input
    if (empty($name) || empty($email) || empty($password) || empty($confirm_password)) {
        $error = "Please fill in all fields";
    } elseif ($password !== $confirm_password) {
        $error = "Passwords do not match";
    } elseif (strlen($password) < 6) {
        $error = "Password must be at least 6 characters long";
    } else {
        // Initialize users array in session if not exists
        if (!isset($_SESSION['users'])) {
            $_SESSION['users'] = array();
        }

        // Check if email already exists
        if (isset($_SESSION['users'][$email])) {
            $error = "Email already registered";
        } else {
            // Generate a simple ID
            $id = count($_SESSION['users']) + 1;
            
            // Store user data in session
            $_SESSION['users'][$email] = array(
                'id' => $id,
                'name' => $name,
                'email' => $email,
                'password' => $password
            );

            $success = "Registration successful! You can now login.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Fashion Store</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <?php include 'header.php'; ?>

    <div class="auth-container">
        <h1>Register</h1>
        
        <?php if ($error): ?>
            <div class="error-message"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <?php if ($success): ?>
            <div class="success-message"><?php echo $success; ?></div>
        <?php endif; ?>

        <form action="register.php" method="POST">
            <div class="form-group">
                <label for="name">Full Name:</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <div class="form-group">
                <label for="confirm_password">Confirm Password:</label>
                <input type="password" id="confirm_password" name="confirm_password" required>
            </div>
            
            <button type="submit" class="btn-primary">Register</button>
        </form>
        
        <p class="auth-links">
            Already have an account? <a href="login.php">Login here</a>
        </p>
    </div>

    <?php include 'footer.php'; ?>
</body>
</html> 