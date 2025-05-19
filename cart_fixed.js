/**
 * ShopLane Cart Management
 * Handles all cart functionality including adding, removing, updating items and checkout
 */

// Function to get cart items from localStorage
function getCartItems() {
    try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            return JSON.parse(cartData);
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
        }
    } catch (error) {
        console.error('Error updating cart:', error);
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
    
    // Remove the item from the DOM
    const cartItem = document.querySelector(`[data-item-id="${itemId}"]`);
    if (cartItem) {
        cartItem.remove();
    }
    
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
}

// Function to update item quantity
function updateQuantity(productId, change) {
    let items = getCartItems();
    const itemIndex = items.findIndex(item => item.id === productId);
    
    if (itemIndex >= 0) {
        if (change === 0) {
            // Remove item completely
            items.splice(itemIndex, 1);
        } else {
            // Update quantity
            const newQty = (items[itemIndex].quantity || 1) + change;
            
            if (newQty <= 0) {
                // Remove item if quantity would be 0 or less
                items.splice(itemIndex, 1);
            } else {
                // Update quantity
                items[itemIndex].quantity = newQty;
            }
        }
        
        updateCart(items);
        
        // Update the displayed quantity and total
        const quantityElement = document.querySelector(`[data-item-id="${productId}"] .quantity`);
        if (quantityElement && itemIndex >= 0 && items[itemIndex]) {
            quantityElement.textContent = items[itemIndex].quantity;
            
            // Update the item total
            const priceElement = document.querySelector(`[data-item-id="${productId}"] .item-total`);
            if (priceElement) {
                priceElement.textContent = `Total: ₹${items[itemIndex].price * items[itemIndex].quantity}`;
            }
            
            // Update the overall total
            updateTotalAmount();
        } else {
            // If the item was removed, refresh the page
            location.reload();
        }
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
    
    if (subtotalElement) {
        subtotalElement.textContent = `₹${totalAmount}`;
    }
    
    if (shippingElement) {
        shippingElement.textContent = totalAmount > 999 ? 'FREE' : '₹99';
    }
    
    if (totalElement) {
        totalElement.textContent = `₹${totalAmount > 999 ? totalAmount : totalAmount + 99}`;
    }
}

// Function to render cart items
function renderCartItems() {
    const cartContainer = document.getElementById('cartContainer');
    if (!cartContainer) return;
    
    // Clear container
    cartContainer.innerHTML = '';
    
    // Get cart items
    const cartItems = getCartItems();
    
    // If cart is empty, show empty cart message
    if (!cartItems || cartItems.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h2>Your Cart is Empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <a href="index.html" class="continue-shopping">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    // Create cart wrapper
    const cartWrapper = document.createElement('div');
    cartWrapper.className = 'cart-wrapper';
    
    // Create cart content for items
    const cartContent = document.createElement('div');
    cartContent.className = 'cart-content';
    
    // Add each cart item to the cart content
    cartItems.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.setAttribute('data-item-id', item.id);
        
        const quantity = item.quantity || 1;
        
        cartItemElement.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="price">Price: ₹${item.price}</p>
                <div class="quantity-controls">
                    <button class="qty-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${quantity}</span>
                    <button class="qty-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <p class="item-total">Total: ₹${item.price * quantity}</p>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                    <span>Remove</span>
                </button>
            </div>
        `;
        
        cartContent.appendChild(cartItemElement);
    });
    
    // Create cart summary
    const cartSummary = document.createElement('div');
    cartSummary.className = 'cart-summary';
    
    let totalAmount = 0;
    cartItems.forEach(item => {
        totalAmount += item.price * (item.quantity || 1);
    });
    
    cartSummary.innerHTML = `
        <h3>Order Summary</h3>
        <div class="summary-item">
            <span>Subtotal:</span>
            <span class="subtotal-value">₹${totalAmount}</span>
        </div>
        <div class="summary-item">
            <span>Shipping:</span>
            <span class="shipping-value">${totalAmount > 999 ? 'FREE' : '₹99'}</span>
        </div>
        <div class="summary-item total">
            <span>Total:</span>
            <span class="total-value">₹${totalAmount > 999 ? totalAmount : totalAmount + 99}</span>
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
            processCheckout();
        });
    }
}

// Function to process checkout
function processCheckout() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please login to continue with checkout.');
        window.location.href = 'login.html?redirect=cart.html';
        return;
    }
    
    const cartItems = getCartItems();
    let totalAmount = 0;
    cartItems.forEach(item => {
        totalAmount += item.price * (item.quantity || 1);
    });
    
    // Save order details to localStorage for order confirmation page
    const orderDetails = {
        items: cartItems,
        subtotal: totalAmount,
        shipping: totalAmount > 999 ? 'FREE' : '₹99',
        total: totalAmount > 999 ? totalAmount : totalAmount + 99,
        orderDate: new Date().toISOString(),
        orderNumber: 'SL-' + Math.floor(Math.random() * 1000000),
        user: user
    };
    
    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
    
    // Save to order history
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.unshift(orderDetails);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Redirect to order confirmation page
    window.location.href = 'orderConfirmation.html';
}

// Initialize cart on page load - runs immediately
(function() {
    // Hide loading indicator immediately
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
    
    // Render cart items immediately
    renderCartItems();
    
    // Update total amount
    updateTotalAmount();
    
    // Update cart badge
    updateCartBadge();
})();
