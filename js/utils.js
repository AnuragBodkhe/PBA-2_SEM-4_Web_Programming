/**
 * ShopLane Utility Functions
 * Contains common functions used across the website
 */

// Debounce function to limit how often a function can be called
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Format currency
function formatCurrency(amount) {
    return '₹' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00$/, '');
}

// Get cart items from localStorage
function getCartItems() {
    try {
        const cartData = localStorage.getItem('cart');
        console.log('Raw cart data from localStorage:', cartData);
        if (cartData) {
            const cartItems = JSON.parse(cartData);
            return cartItems;
        }
    } catch (error) {
        console.error('Error getting cart items:', error);
    }
    return [];
}

// Update cart badge count
function updateCartBadge() {
    try {
        const cart = getCartItems();
        let count = 0;
        cart.forEach(item => {
            count += item.quantity || 1;
        });
        const badge = document.getElementById("badge");
        if (badge) {
            badge.textContent = count;
        }
    } catch (error) {
        console.error('Error updating cart badge:', error);
    }
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('user') !== null;
}

// Get user data
function getUserData() {
    try {
        return JSON.parse(localStorage.getItem('user')) || null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

// Redirect to login if not logged in
function requireLogin(redirectUrl) {
    if (!isLoggedIn()) {
        window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl || window.location.href)}`;
        return false;
    }
    return true;
}

// Show toast notification
function showToast(message, type = 'success', duration = 3000) {
    // Remove any existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <div class="toast-message">${message}</div>
        </div>
        <div class="toast-progress"></div>
    `;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
        
        // Set progress bar animation duration
        const progressBar = toast.querySelector('.toast-progress');
        progressBar.style.transition = `width ${duration}ms linear`;
        progressBar.style.width = '0%';
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

// Load HTML content into element
function loadContent(elementId, url, callback) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    fetch(url)
        .then(response => response.text())
        .then(html => {
            element.innerHTML = html;
            if (callback && typeof callback === 'function') {
                callback();
            }
        })
        .catch(error => {
            console.error(`Error loading ${url} into ${elementId}:`, error);
            element.innerHTML = `<div class="error-message">Failed to load content. Please refresh the page.</div>`;
        });
}

// Add CSS styles for toast notifications
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: white;
            color: #333;
            padding: 0;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            overflow: hidden;
            transform: translateX(110%);
            transition: transform 0.3s ease;
            max-width: 350px;
            width: 100%;
        }
        
        .toast.show {
            transform: translateX(0);
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            padding: 12px 15px;
        }
        
        .toast i {
            margin-right: 10px;
            font-size: 20px;
        }
        
        .toast.success i {
            color: #4CAF50;
        }
        
        .toast.error i {
            color: #F44336;
        }
        
        .toast.info i {
            color: #2196F3;
        }
        
        .toast-message {
            flex-grow: 1;
            font-size: 14px;
        }
        
        .toast-progress {
            height: 3px;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.1);
        }
        
        .toast.success .toast-progress {
            background-color: #4CAF50;
        }
        
        .toast.error .toast-progress {
            background-color: #F44336;
        }
        
        .toast.info .toast-progress {
            background-color: #2196F3;
        }
        
        @media (max-width: 480px) {
            .toast {
                top: 10px;
                right: 10px;
                left: 10px;
                width: calc(100% - 20px);
                max-width: none;
            }
        }
    `;
    document.head.appendChild(style);
});

// Preload images for smoother experience
function preloadImages(images) {
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Lazy load images
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update cart badge
    updateCartBadge();
    
    // Setup lazy loading
    setupLazyLoading();
    
    // Listen for storage events to update cart badge when cart changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart' || e.key === 'cartCount') {
            updateCartBadge();
        }
    });
});
