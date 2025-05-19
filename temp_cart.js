/**
 * ShopLane Cart Management
 * Handles all cart functionality including adding, removing, updating items and checkout
 */

console.clear();

// Function to update cart in localStorage
function updateCart(items) {
    try {
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(items));
        
        // Update badge
        updateCartBadge();
        
        // Update total items count
        const totalItem = document.getElementById("totalItem");
        if (totalItem) {
            let totalQuantity = 0;
            items.forEach(item => {
                totalQuantity += item.quantity || 1;
            });
            totalItem.textContent = `Total Items: ${totalQuantity}`;
            
            // Add animation to highlight the change
            totalItem.classList.add('highlight');
            setTimeout(() => {
                totalItem.classList.remove('highlight');
            }, 1000);
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        showToast('There was an error updating your cart', 'error');
    }
}

// Function to remove item from cart
function removeFromCart(itemId) {
    let items = getCartItems();
    
    // Find the item to be removed for the notification
    const removedItem = items.find(item => item.id === itemId);
    const itemName = removedItem ? removedItem.name : 'Item';
    
    // Filter out the item
    items = items.filter(item => item.id !== itemId);
    updateCart(items);
    
    // Remove the item from the DOM with animation
    const cartItem = document.querySelector(`[data-item-id="${itemId}"]`);
    if (cartItem) {
        // Add fade-out animation
        cartItem.classList.add('removing');
        
        // Wait for animation to complete before removing
        setTimeout(() => {
            cartItem.remove();
            
            // If cart is empty, show empty cart message
            if (items.length === 0) {
                const cartContainer = document.getElementById('cartContainer');
                if (cartContainer) {
                    cartContainer.innerHTML = `
                        <div class="empty-cart">
                            <i class="fas fa-shopping-cart"></i>
                            <h2>Your Cart is Empty</h2>
                            <p>Looks like you haven't added anything to your cart yet.</p>
                            <a href="index.html" class="continue-shopping">Continue Shopping</a>
                        </div>
                    `;
                }
            }
            
            // Update the total amount
            updateTotalAmount();
        }, 300); // Match this with the CSS animation duration
        
        // Show toast notification
        showToast(`${itemName} removed from cart`, 'info');
    } else {
        // If the DOM element wasn't found, still update totals
        updateTotalAmount();
    }
}

// Function to update item quantity
function updateQuantity(productId, change) {
    console.log(`Updating quantity for product ${productId} by ${change}`);
    let items = getCartItems();
    const itemIndex = items.findIndex(item => item.id === productId);
    
    if (itemIndex >= 0) {
        const item = items[itemIndex];
        const currentQty = item.quantity || 1;
        
        if (change === 0) {
            // Remove item completely - use the removeFromCart function for consistency
            removeFromCart(productId);
            return;
        } else {
            // Update quantity
            const newQty = currentQty + change;
            
            if (newQty <= 0) {
                // Remove item if quantity would be 0 or less
                removeFromCart(productId);
                return;
            } else {
                // Update quantity
                item.quantity = newQty;
                
                // Show appropriate message
                if (change > 0) {
                    showToast(`Increased ${item.name} quantity to ${newQty}`, 'success');
                } else {
                    showToast(`Decreased ${item.name} quantity to ${newQty}`, 'info');
                }
            }
        }
        
        updateCart(items);
        
        // Update the displayed quantity and total with animation
        const quantityElement = document.querySelector(`[data-item-id="${productId}"] .quantity`);
        if (quantityElement) {
            // Add pulse animation
            quantityElement.classList.add('pulse');
            quantityElement.textContent = item.quantity;
            
            // Remove animation after it completes
            setTimeout(() => {
                quantityElement.classList.remove('pulse');
            }, 500);
            
            // Update the item total with animation
            const priceElement = document.querySelector(`[data-item-id="${productId}"] .item-total`);
            if (priceElement) {
                priceElement.classList.add('flash');
                priceElement.textContent = `Total: ${formatCurrency(item.price * item.quantity)}`;
                
                setTimeout(() => {
                    priceElement.classList.remove('flash');
                }, 500);
            }
            
            // Update the overall total
            updateTotalAmount();
        }
    } else {
        console.error(`Product with ID ${productId} not found in cart`);
        showToast('Error updating quantity', 'error');
    }
}

// Function to calculate and update the total amount
function updateTotalAmount() {
    const items = getCartItems();
    let totalAmount = 0;
    
    items.forEach(item => {
        totalAmount += item.price * (item.quantity || 1);
    });
    
    const subtotalElement = document.querySelector('.summary-item .subtotal-value');
    const shippingElement = document.querySelector('.summary-item .shipping-value');
    const totalElement = document.querySelector('.summary-item.total .total-value');
    
    // Helper function to animate value changes
    function animateValueChange(element, newValue) {
        if (!element) return;
        
        // Add animation class
        element.classList.add('updating');
        
        // Update the value
        element.textContent = newValue;
        
        // Remove animation class after animation completes
        setTimeout(() => {
            element.classList.remove('updating');
        }, 600);
    }
    
    if (subtotalElement) {
        animateValueChange(subtotalElement, formatCurrency(totalAmount));
    }
    
    if (shippingElement) {
        const shippingCost = totalAmount > 999 ? 'FREE' : formatCurrency(99);
        animateValueChange(shippingElement, shippingCost);
    }
    
    if (totalElement) {
        const finalTotal = totalAmount > 999 ? totalAmount : totalAmount + 99;
        animateValueChange(totalElement, formatCurrency(finalTotal));
    }
    
    // Update checkout button state
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        if (items.length === 0) {
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add('disabled');
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.classList.remove('disabled');
        }
    }
}

// Function to render cart items
function renderCartItems(cartItems) {
    console.log("Rendering cart items:", cartItems);
    const cartContainer = document.getElementById('cartContainer');
    if (!cartContainer) {
        console.error('Cart container not found');
        return;
    }
    
    // Clear loading indicator and content
    cartContainer.innerHTML = '';
    
    // If cart is empty, show empty cart message
    if (!cartItems || cartItems.length === 0) {
        const emptyCartMessage = document.createElement('div');
        emptyCartMessage.className = 'empty-cart';
        emptyCartMessage.innerHTML = `
            <i class="fas fa-shopping-cart"></i>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <a href="index.html" class="continue-shopping">Continue Shopping</a>
        `;
        
        cartContainer.appendChild(emptyCartMessage);
        return;
    }
    
    console.log('Rendering cart with items:', cartItems);
    
    // Create cart wrapper
    const cartWrapper = document.createElement('div');
    cartWrapper.className = 'cart-wrapper';
    
    // Create cart content for items
    const cartContent = document.createElement('div');
    cartContent.className = 'cart-content';
    
    // Create cart summary
    const cartSummary = document.createElement('div');
    cartSummary.className = 'cart-summary';
    
    let totalAmount = 0;
    
    // Add each cart item to the cart content
    cartItems.forEach(item => {
        console.log('Rendering cart item:', item);
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.setAttribute('data-item-id', item.id);
        
        const quantity = item.quantity || 1;
        const itemTotal = item.price * quantity;
        totalAmount += itemTotal;
        
        cartItemElement.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="brand">Brand: ${item.brand || 'Generic'}</p>
                <p class="price">Price: ${formatCurrency(item.price)}</p>
                <div class="quantity-controls">
                    <button class="qty-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${quantity}</span>
                    <button class="qty-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <p class="item-total">Total: ${formatCurrency(itemTotal)}</p>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                    <span>Remove</span>
                </button>
            </div>
        `;
        
        cartContent.appendChild(cartItemElement);
    });
    
    console.log('Total amount calculated:', totalAmount);
    
    // Set cart summary content
    cartSummary.innerHTML = `
        <h3>Order Summary</h3>
        <div class="summary-item">
            <span>Subtotal:</span>
            <span class="subtotal-value">${formatCurrency(totalAmount)}</span>
        </div>
        <div class="summary-item">
            <span>Shipping:</span>
            <span class="shipping-value">${totalAmount > 999 ? 'FREE' : formatCurrency(99)}</span>
        </div>
        <div class="summary-item total">
            <span>Total:</span>
            <span class="total-value">${formatCurrency(totalAmount > 999 ? totalAmount : totalAmount + 99)}</span>
        </div>
        <button id="checkout-btn" class="checkout-btn">
            Proceed to Checkout
        </button>
        <a href="index.html" class="continue-shopping">Continue Shopping</a>
    `;
    
    // Append cart content and summary to wrapper
    cartWrapper.appendChild(cartContent);
    cartWrapper.appendChild(cartSummary);
    
    // Append wrapper to container
    cartContainer.appendChild(cartWrapper);
    
    // Add event listener to checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            processCheckout(cartItems, totalAmount);
        });
    }
}

// Function for debug - add a test product to cart
function addTestProduct() {
    const testProduct = {
        id: 1,
        name: "Test Product",
        price: 999,
        image: "https://via.placeholder.com/150",
        brand: "Test Brand",
        quantity: 1
    };
    
    let cart = getCartItems();
    cart.push(testProduct);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showToast("Test product added to cart", "success");
    // Reload page
    window.location.reload();
}

// Function to process checkout and place order
function processCheckout(items, totalAmount) {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showToast('Please login to continue with checkout.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html?redirect=cart.html';
        }, 2000);
        return;
    }
    
    // Save order details to localStorage for order confirmation page
    const orderDetails = {
        items: items,
        subtotal: totalAmount,
        shipping: totalAmount > 999 ? 'FREE' : formatCurrency(99),
        total: totalAmount > 999 ? totalAmount : totalAmount + 99,
        orderDate: new Date().toISOString(),
        orderNumber: generateOrderNumber(),
        user: user
    };
    
    // Save to localStorage
    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
    
    // Add to orders history
    saveOrderToHistory(orderDetails);
    
    // Simulate sending order confirmation email
    simulateSendEmail(user.email, orderDetails);
    
    // Clear cart
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Show success message
    showToast('Order placed successfully! Redirecting to confirmation page...', 'success');
    
    // Redirect to order confirmation page after a short delay
    setTimeout(() => {
        window.location.href = 'orderConfirmation.html';
    }, 1500);
}

// Function to generate a unique order number
function generateOrderNumber() {
    const timestamp = new Date().getTime().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `SL-${timestamp}-${random}`;
}

// Function to save order to history
function saveOrderToHistory(orderDetails) {
    try {
        // Get existing orders
        const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
        
        // Add new order to the beginning of the array
        existingOrders.unshift(orderDetails);
        
        // Save back to localStorage
        localStorage.setItem('orders', JSON.stringify(existingOrders));
        
        console.log('Order saved to history:', orderDetails);
    } catch (error) {
        console.error('Error saving order to history:', error);
    }
}

// Function to simulate sending an order confirmation email
function simulateSendEmail(email, orderDetails) {
    console.log(`Simulating sending email to ${email} with order details:`, orderDetails);
    // In a real application, this would make an API call to your backend
    // which would then send an actual email to the customer
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('Cart page initialized');
        
        // Show loading indicator
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
        }
        
        // Update cart badge immediately
        updateCartBadge();
        
        // Get cart items immediately - no delay
        const cartItems = getCartItems();
        console.log('Cart items on page load:', cartItems);
        
        // Hide loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        // Render cart items
        renderCartItems(cartItems);
        
        // Update total amount
        updateTotalAmount();
        
        // Show welcome toast if cart has items
        if (cartItems && cartItems.length > 0) {
            showToast(`Welcome back! You have ${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'} in your cart.`, 'info');
        }
        
        // Add a debug button to add a test product (remove in production)
        const cartHeader = document.querySelector('.cart-header');
        if (cartHeader && window.location.href.includes('debug=true')) {
            const debugButton = document.createElement('button');
            debugButton.textContent = 'Add Test Product';
            debugButton.style.marginLeft = '10px';
            debugButton.style.padding = '5px 10px';
            debugButton.style.background = '#ccc';
            debugButton.style.border = 'none';
            debugButton.style.borderRadius = '3px';
            debugButton.style.cursor = 'pointer';
            debugButton.onclick = addTestProduct;
            cartHeader.appendChild(debugButton);
        }
    } catch (error) {
        console.error('Error initializing cart:', error);
        showToast('There was an error loading your cart', 'error');
        
        // Hide loading indicator on error
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        // Show empty cart message on error
        const cartContainer = document.getElementById('cartContainer');
        if (cartContainer) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-exclamation-circle"></i>
                    <h2>Something went wrong</h2>
                    <p>We couldn't load your cart. Please try refreshing the page.</p>
                    <a href="index.html" class="continue-shopping">Continue Shopping</a>
                </div>
            `;
        }
    }
});
