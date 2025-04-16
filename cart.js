console.clear();

// Update cart badge if exists
function updateCartBadge() {
    if(document.cookie.indexOf(',counter=')>=0) {
        let counter = document.cookie.split(',')[1].split('=')[1];
        document.getElementById("badge").innerHTML = counter;
    }
}

// Function to get cart items from cookie
function getCartItems() {
    let cookies = document.cookie.split(';');
    let cartItems = [];
    
    cookies.forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name === 'items') {
            cartItems = value ? value.split(' ').filter(Boolean) : [];
        }
    });
    
    return cartItems;
}

// Function to update cart cookie
function updateCartCookie(items) {
    const date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    
    document.cookie = `items=${items.join(' ')}${expires}; path=/`;
    document.cookie = `counter=${items.length}${expires}; path=/`;
    
    // Update cart badge
    const badge = document.getElementById("badge");
    if (badge) {
        badge.innerHTML = items.length;
    }
    
    // Update total items count
    const totalItem = document.getElementById("totalItem");
    if (totalItem) {
        totalItem.textContent = `Total Items: ${items.length}`;
    }
}

// Function to remove item from cart
function removeFromCart(itemId) {
    let items = getCartItems();
    items = items.filter(item => item !== itemId);
    updateCartCookie(items);
    
    // Remove the item from the DOM
    const cartItem = document.querySelector(`[data-item-id="${itemId}"]`);
    if (cartItem) {
        cartItem.remove();
    }
    
    // If cart is empty, show empty cart message
    if (items.length === 0) {
        const cartContent = document.querySelector('.cart-content');
        if (cartContent) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h2>Your Cart is Empty</h2>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <a href="index.html" class="continue-shopping">Continue Shopping</a>
                </div>
            `;
        }
    }
    
    // Reload the page to update the total amount
    location.reload();
}

// Function to update item quantity
function updateQuantity(productId, change) {
    let items = getCartItems();
    if (change === 0) {
        // Remove item completely
        items = items.filter(item => item !== productId);
    } else {
        // Find current quantity
        const currentQty = items.filter(item => item === productId).length;
        const newQty = currentQty + change;
        
        if (newQty <= 0) {
            // Remove item if quantity would be 0 or less
            items = items.filter(item => item !== productId);
        } else {
            // Update quantity
            items = items.filter(item => item !== productId);
            for (let i = 0; i < newQty; i++) {
                items.push(productId);
            }
        }
    }
    
    updateCartCookie(items);
    location.reload();
}

// Function to create cart item card
function createCartItem(product, count) {
    let cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.setAttribute('data-item-id', product.id);
    
    cartItem.innerHTML = `
        <div class="item-image">
            <img src="${product.preview}" alt="${product.name}">
        </div>
        <div class="item-details">
            <h3>${product.name}</h3>
            <p class="brand">${product.brand}</p>
            <div class="item-info">
                <div class="quantity-controls">
                    <button class="qty-btn minus" onclick="updateQuantity('${product.id}', -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${count}</span>
                    <button class="qty-btn plus" onclick="updateQuantity('${product.id}', 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <p class="price">Amount: Rs ${product.price * count}</p>
            </div>
            <button class="remove-btn" onclick="updateQuantity('${product.id}', 0)">
                <i class="fas fa-trash"></i>
                <span>Remove</span>
            </button>
        </div>
    `;
    
    return cartItem;
}

// Function to update total amount
function updateTotalAmount(amount) {
    const totalSection = document.createElement('div');
    totalSection.className = 'cart-total';
    
    totalSection.innerHTML = `
        <div class="total-details">
            <div class="subtotal">
                <span>Subtotal</span>
                <span>Rs ${amount}</span>
            </div>
            <div class="shipping">
                <span>Shipping</span>
                <span>${amount > 999 ? 'FREE' : 'Rs 99'}</span>
            </div>
            <div class="total">
                <span>Total</span>
                <span>Rs ${amount > 999 ? amount : amount + 99}</span>
            </div>
        </div>
        <button id="checkout-btn" onclick="window.location.href='orderPlaced.html'">
            Proceed to Checkout
        </button>
    `;
    
    return totalSection;
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart initialization started');
    console.log('Current cookies:', document.cookie);
    
    const cartContainer = document.getElementById('cartContainer');
    const cartItems = getCartItems();
    
    console.log('Cart items found:', cartItems);
    
    // Add cart wrapper
    const cartWrapper = document.createElement('div');
    cartWrapper.className = 'cart-wrapper';
    
    // Create cart content section
    const cartContent = document.createElement('div');
    cartContent.className = 'cart-content';
    
    if (cartItems.length === 0) {
        // Show empty cart message
        cartContent.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h2>Your Cart is Empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <a href="index.html" class="continue-shopping">Continue Shopping</a>
            </div>
        `;
        cartWrapper.appendChild(cartContent);
        cartContainer.appendChild(cartWrapper);
    } else {
        // Fetch products and show cart items
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product', true);
        
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    const products = JSON.parse(this.responseText);
                    let totalAmount = 0;
                    
                    // Count occurrences of each item
                    const itemCounts = {};
                    cartItems.forEach(item => {
                        itemCounts[item] = (itemCounts[item] || 0) + 1;
                    });
                    
                    console.log('Item counts:', itemCounts);
                    
                    // Create cart items
                    Object.keys(itemCounts).forEach(itemId => {
                        const product = products.find(p => p.id === itemId);
                        if (product) {
                            const count = itemCounts[itemId];
                            totalAmount += product.price * count;
                            cartContent.appendChild(createCartItem(product, count));
                        }
                    });
                    
                    // Update total items count
                    const totalItem = document.getElementById("totalItem");
                    if (totalItem) {
                        totalItem.textContent = `Total Items: ${cartItems.length}`;
                    }
                    
                    // Add cart sections to page
                    cartWrapper.appendChild(cartContent);
                    cartWrapper.appendChild(updateTotalAmount(totalAmount));
                    cartContainer.appendChild(cartWrapper);
                    
                    console.log('Cart rendered successfully');
                } else {
                    // Show error message
                    cartContent.innerHTML = `
                        <div class="error-message">
                            <i class="fas fa-exclamation-circle"></i>
                            <h2>Unable to Load Cart Items</h2>
                            <p>Please try refreshing the page or contact support if the problem persists.</p>
                            <button onclick="location.reload()">Refresh Page</button>
                        </div>
                    `;
                    cartWrapper.appendChild(cartContent);
                    cartContainer.appendChild(cartWrapper);
                }
            }
        };
        
        xhr.send();
    }
});

// Add CSS styles
const styles = document.createElement('style');
styles.textContent = `
    .cart-wrapper {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 30px;
    }
    
    .cart-item {
        display: flex;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .cart-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    .item-image {
        width: 150px;
        min-width: 150px;
        position: relative;
    }
    
    .item-image img {
        width: 100%;
        height: 150px;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
    
    .item-details {
        padding: 20px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    
    .item-details h3 {
        margin: 0 0 10px;
        font-size: 18px;
        color: #333;
    }
    
    .brand {
        color: #666;
        margin-bottom: 10px;
        font-size: 14px;
    }
    
    .item-info {
        margin: 10px 0;
    }
    
    .quantity, .price {
        margin-bottom: 8px;
        font-size: 15px;
        color: #444;
    }
    
    .remove-btn {
        background: #ff4444;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        width: fit-content;
        margin-top: 10px;
    }
    
    .remove-btn i {
        font-size: 16px;
    }
    
    .remove-btn span {
        font-size: 14px;
    }
    
    .remove-btn:hover {
        background: #cc0000;
        transform: scale(1.05);
    }
    
    .remove-btn:active {
        transform: scale(0.95);
    }
    
    .cart-total {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        position: sticky;
        top: 20px;
    }
    
    .total-details > div {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
    }
    
    .total {
        font-size: 18px;
        font-weight: bold;
        border-top: 1px solid #eee;
        padding-top: 15px;
    }
    
    #checkout-btn {
        width: 100%;
        padding: 15px;
        background: #1e88e5;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.3s;
    }
    
    #checkout-btn:hover {
        background: #1565c0;
    }
    
    .empty-cart {
        text-align: center;
        padding: 40px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        grid-column: 1 / -1;
    }
    
    .empty-cart i {
        font-size: 48px;
        color: #ccc;
        margin-bottom: 20px;
    }
    
    .empty-cart h2 {
        margin-bottom: 10px;
    }
    
    .empty-cart p {
        color: #666;
        margin-bottom: 20px;
    }
    
    .continue-shopping {
        display: inline-block;
        padding: 10px 20px;
        background: #1e88e5;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        transition: background 0.3s;
    }
    
    .continue-shopping:hover {
        background: #1565c0;
    }
    
    .error-message {
        text-align: center;
        padding: 40px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .error-message i {
        font-size: 48px;
        color: #ff4444;
        margin-bottom: 20px;
    }
    
    .error-message h2 {
        margin-bottom: 10px;
        color: #333;
    }
    
    .error-message p {
        color: #666;
        margin-bottom: 20px;
    }
    
    .error-message button {
        padding: 10px 20px;
        background: #1e88e5;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.3s;
    }
    
    .error-message button:hover {
        background: #1565c0;
    }
    
    @media (max-width: 768px) {
        .cart-wrapper {
            grid-template-columns: 1fr;
            padding: 10px;
        }
        
        .cart-item {
            flex-direction: column;
        }
        
        .item-image {
            width: 100%;
            height: 200px;
        }
        
        .item-image img {
            height: 100%;
        }
        
        .item-details {
            padding: 15px;
        }
        
        .remove-btn {
            width: 100%;
            justify-content: center;
            padding: 12px;
            margin-top: 15px;
        }
        
        .remove-btn i {
            font-size: 18px;
        }
        
        .remove-btn span {
            font-size: 16px;
        }
    }
    
    @media (max-width: 480px) {
        .cart-item {
            margin-bottom: 15px;
        }
        
        .item-details h3 {
            font-size: 16px;
        }
        
        .brand {
            font-size: 13px;
        }
        
        .quantity, .price {
            font-size: 14px;
        }
        
        .remove-btn {
            padding: 10px;
        }
    }
    
    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        background: #f8f9fa;
        padding: 8px;
        border-radius: 4px;
        width: fit-content;
    }
    
    .qty-btn {
        background: white;
        border: 1px solid #ddd;
        color: #333;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .qty-btn:hover {
        background: #1e88e5;
        border-color: #1e88e5;
        color: white;
    }
    
    .qty-btn:active {
        transform: scale(0.95);
    }
    
    .qty-btn.minus {
        border-color: #ff4444;
        color: #ff4444;
    }
    
    .qty-btn.minus:hover {
        background: #ff4444;
        border-color: #ff4444;
        color: white;
    }
    
    .qty-btn.plus {
        border-color: #00C851;
        color: #00C851;
    }
    
    .qty-btn.plus:hover {
        background: #00C851;
        border-color: #00C851;
        color: white;
    }
    
    .quantity {
        font-size: 16px;
        font-weight: 600;
        min-width: 24px;
        text-align: center;
    }
    
    @media (max-width: 768px) {
        .quantity-controls {
            width: 100%;
            justify-content: center;
            margin: 15px 0;
        }
        
        .qty-btn {
            width: 40px;
            height: 40px;
        }
        
        .quantity {
            font-size: 18px;
            min-width: 30px;
        }
    }
`;

document.head.appendChild(styles);




