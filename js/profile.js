// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    
    if (!userData) {
        // Redirect to login if not logged in
        window.location.href = 'login.html?redirect=profile.html';
        return;
    }
    
    // Populate user data
    populateUserData(userData);
    
    // Load order history
    loadOrderHistory();
    
    // Tab switching functionality
    const tabLinks = document.querySelectorAll('.profile-menu li');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabLinks.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabLinks.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to current tab
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Address form submission
    const addressForm = document.getElementById('address-form');
    if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAddress();
        });
    }
    
    // Load addresses
    loadAddresses();
    
    // Personal info form submission
    const personalInfoForm = document.getElementById('personal-info-form');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            savePersonalInfo();
        });
    }
    
    // Settings functionality
    setupSettingsListeners();
    
    // Load wishlist
    loadWishlist();
});

// Function to populate user data
function populateUserData(userData) {
    // Personal info form
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const dobInput = document.getElementById('dob');
    
    if (fullNameInput && userData.name) fullNameInput.value = userData.name;
    if (emailInput && userData.email) emailInput.value = userData.email;
    if (phoneInput && userData.phone) phoneInput.value = userData.phone;
    if (dobInput && userData.dob) dobInput.value = userData.dob;
    
    // Set gender
    if (userData.gender) {
        const genderRadio = document.querySelector(`input[name="gender"][value="${userData.gender}"]`);
        if (genderRadio) genderRadio.checked = true;
    }
}

// Function to save personal info
function savePersonalInfo() {
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    
    // Get form values
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const dob = document.getElementById('dob').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    
    // Update user data
    userData.name = fullName;
    userData.email = email;
    userData.phone = phone;
    userData.dob = dob;
    userData.gender = gender;
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Show confirmation
    alert('Personal information updated successfully!');
}

// Function to load order history
function loadOrderHistory() {
    const ordersList = document.querySelector('.orders-list');
    if (!ordersList) return;
    
    // Get orders from localStorage
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    
    // Clear current content
    ordersList.innerHTML = '';
    
    if (orderHistory.length === 0) {
        ordersList.innerHTML = '<p class="empty-message">You haven\'t placed any orders yet.</p>';
        return;
    }
    
    // Add each order to the list
    orderHistory.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-item';
        
        // Create order header
        const orderHeader = document.createElement('div');
        orderHeader.className = 'order-header';
        orderHeader.innerHTML = `
            <div class="order-id">Order #${order.orderNumber}</div>
            <div class="order-date">${order.orderDate}</div>
            <div class="order-status ${order.status.toLowerCase()}">${order.status}</div>
        `;
        
        // Create order products container
        const orderProducts = document.createElement('div');
        orderProducts.className = 'order-products';
        
        // Add each product in the order
        order.items.forEach(item => {
            const productElement = document.createElement('div');
            productElement.className = 'order-product';
            productElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="product-details">
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                    <p>₹${item.price}</p>
                </div>
            `;
            orderProducts.appendChild(productElement);
        });
        
        // Create order footer
        const orderFooter = document.createElement('div');
        orderFooter.className = 'order-footer';
        orderFooter.innerHTML = `
            <div class="order-total">Total: ₹${order.total}</div>
            <button class="btn-secondary view-details" data-order-id="${order.orderNumber}">View Details</button>
        `;
        
        // Add event listener to view details button
        orderFooter.querySelector('.view-details').addEventListener('click', function() {
            viewOrderDetails(order);
        });
        
        // Assemble the complete order element
        orderElement.appendChild(orderHeader);
        orderElement.appendChild(orderProducts);
        orderElement.appendChild(orderFooter);
        
        // Add to orders list
        ordersList.appendChild(orderElement);
    });
    
    // Add event listeners to track order buttons
    document.querySelectorAll('.track-order').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            alert(`Tracking information for order #${orderId} will be displayed here.`);
        });
    });
}

// Function to view order details
function viewOrderDetails(order) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    modalHeader.innerHTML = `
        <h3>Order Details</h3>
        <button class="modal-close">&times;</button>
    `;
    
    // Create modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    // Order info section
    const orderInfo = document.createElement('div');
    orderInfo.className = 'order-info';
    orderInfo.innerHTML = `
        <div class="order-info-item">
            <span>Order Number:</span>
            <span>#${order.orderNumber}</span>
        </div>
        <div class="order-info-item">
            <span>Date:</span>
            <span>${order.orderDate}</span>
        </div>
        <div class="order-info-item">
            <span>Status:</span>
            <span class="${order.status.toLowerCase()}">${order.status}</span>
        </div>
    `;
    
    // Items section
    const itemsSection = document.createElement('div');
    itemsSection.className = 'order-items-section';
    itemsSection.innerHTML = '<h4>Items</h4>';
    
    const itemsList = document.createElement('div');
    itemsList.className = 'order-items-list';
    
    order.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-detail-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h5>${item.name}</h5>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: ₹${item.price}</p>
                <p>Total: ₹${item.price * item.quantity}</p>
            </div>
        `;
        itemsList.appendChild(itemElement);
    });
    
    itemsSection.appendChild(itemsList);
    
    // Summary section
    const summarySection = document.createElement('div');
    summarySection.className = 'order-summary-section';
    summarySection.innerHTML = `
        <h4>Order Summary</h4>
        <div class="summary-item">
            <span>Subtotal:</span>
            <span>₹${typeof order.subtotal !== 'undefined' ? order.subtotal : order.total}</span>
        </div>
        <div class="summary-item">
            <span>Shipping:</span>
            <span>${order.shipping || 'FREE'}</span>
        </div>
        <div class="summary-item total">
            <span>Total:</span>
            <span>₹${order.total}</span>
        </div>
    `;
    
    // Append sections to modal body
    modalBody.appendChild(orderInfo);
    modalBody.appendChild(itemsSection);
    modalBody.appendChild(summarySection);
    
    // Assemble modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalOverlay.appendChild(modalContent);
    
    // Add to document
    document.body.appendChild(modalOverlay);
    
    // Add event listener to close button
    modalContent.querySelector('.modal-close').addEventListener('click', function() {
        document.body.removeChild(modalOverlay);
    });
    
    // Close on click outside modal
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            document.body.removeChild(modalOverlay);
        }
    });
}

// Function to load addresses
function loadAddresses() {
    const addressesContainer = document.getElementById('addresses-container');
    if (!addressesContainer) return;
    
    // Get addresses from localStorage
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    const addresses = userData.addresses || [];
    
    // Clear current content
    addressesContainer.innerHTML = '';
    
    if (addresses.length === 0) {
        addressesContainer.innerHTML = '<p class="empty-message">You don\'t have any saved addresses yet.</p>';
        return;
    }
    
    // Add each address to the container
    addresses.forEach((address, index) => {
        const addressElement = document.createElement('div');
        addressElement.className = 'address-item';
        addressElement.innerHTML = `
            <div class="address-header">
                <h3>${address.name}</h3>
                ${address.isDefault ? '<span class="default-badge">Default</span>' : ''}
            </div>
            <div class="address-content">
                <p>${address.fullName}</p>
                <p>${address.street}</p>
                <p>${address.city}, ${address.state} ${address.pincode}</p>
                <p>Phone: ${address.phone}</p>
            </div>
            <div class="address-actions">
                <button class="btn-outline edit-address" data-index="${index}">Edit</button>
                <button class="btn-remove delete-address" data-index="${index}">Delete</button>
                ${!address.isDefault ? `<button class="btn-outline set-default" data-index="${index}">Set as Default</button>` : ''}
            </div>
        `;
        
        addressesContainer.appendChild(addressElement);
    });
    
    // Add event listeners to address buttons
    document.querySelectorAll('.edit-address').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            editAddress(index);
        });
    });
    
    document.querySelectorAll('.delete-address').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            deleteAddress(index);
        });
    });
    
    document.querySelectorAll('.set-default').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            setDefaultAddress(index);
        });
    });
}

// Function to save address
function saveAddress() {
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    const addresses = userData.addresses || [];
    
    // Get form values
    const addressName = document.getElementById('address-name').value;
    const fullName = document.getElementById('full-name-address').value;
    const street = document.getElementById('street-address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const pincode = document.getElementById('pincode').value;
    const phone = document.getElementById('phone-address').value;
    
    // Create new address object
    const newAddress = {
        name: addressName,
        fullName: fullName,
        street: street,
        city: city,
        state: state,
        pincode: pincode,
        phone: phone,
        isDefault: addresses.length === 0 // Set as default if it's the first address
    };
    
    // Add to addresses array
    addresses.push(newAddress);
    
    // Update user data
    userData.addresses = addresses;
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Reset form
    document.getElementById('address-form').reset();
    
    // Reload addresses
    loadAddresses();
    
    // Show confirmation
    alert('Address added successfully!');
}

// Function to edit address
function editAddress(index) {
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    const addresses = userData.addresses || [];
    const address = addresses[index];
    
    if (!address) return;
    
    // Populate form with address data
    document.getElementById('address-name').value = address.name;
    document.getElementById('full-name-address').value = address.fullName;
    document.getElementById('street-address').value = address.street;
    document.getElementById('city').value = address.city;
    document.getElementById('state').value = address.state;
    document.getElementById('pincode').value = address.pincode;
    document.getElementById('phone-address').value = address.phone;
    
    // Scroll to form
    document.getElementById('address-form-container').scrollIntoView({ behavior: 'smooth' });
    
    // Remove existing event listener
    const form = document.getElementById('address-form');
    const clonedForm = form.cloneNode(true);
    form.parentNode.replaceChild(clonedForm, form);
    
    // Add new event listener for updating
    clonedForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Update address data
        addresses[index] = {
            name: document.getElementById('address-name').value,
            fullName: document.getElementById('full-name-address').value,
            street: document.getElementById('street-address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            pincode: document.getElementById('pincode').value,
            phone: document.getElementById('phone-address').value,
            isDefault: address.isDefault
        };
        
        // Update user data
        userData.addresses = addresses;
        
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Reset form
        clonedForm.reset();
        
        // Reload addresses
        loadAddresses();
        
        // Show confirmation
        alert('Address updated successfully!');
        
        // Reset form submission to add mode
        clonedForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAddress();
        });
    });
}

// Function to delete address
function deleteAddress(index) {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    const addresses = userData.addresses || [];
    
    // Check if it's the default address
    const isDefault = addresses[index].isDefault;
    
    // Remove the address
    addresses.splice(index, 1);
    
    // If it was the default and there are still addresses, set the first one as default
    if (isDefault && addresses.length > 0) {
        addresses[0].isDefault = true;
    }
    
    // Update user data
    userData.addresses = addresses;
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Reload addresses
    loadAddresses();
    
    // Show confirmation
    alert('Address deleted successfully!');
}

// Function to set default address
function setDefaultAddress(index) {
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    const addresses = userData.addresses || [];
    
    // Remove default from all addresses
    addresses.forEach(address => {
        address.isDefault = false;
    });
    
    // Set new default
    addresses[index].isDefault = true;
    
    // Update user data
    userData.addresses = addresses;
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Reload addresses
    loadAddresses();
    
    // Show confirmation
    alert('Default address updated successfully!');
}

// Function to setup settings listeners
function setupSettingsListeners() {
    const logoutBtn = document.querySelector('#settings .logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to log out?')) {
                // Don't actually log out in this demo version
                // In a real app, you might clear the session
                alert('This is a demo - logout functionality would be implemented here');
            }
        });
    }
}

// Function to load wishlist
function loadWishlist() {
    const wishlistContainer = document.querySelector('.wishlist-items');
    if (!wishlistContainer) return;
    
    // Get wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Clear current content
    wishlistContainer.innerHTML = '';
    
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p class="empty-message">Your wishlist is empty.</p>';
        return;
    }
    
    // Add each item to the wishlist
    wishlist.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="wishlist-item-details">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
                <div class="wishlist-actions">
                    <button class="btn-primary add-to-cart" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}">Add to Cart</button>
                    <button class="btn-remove remove-from-wishlist" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        
        wishlistContainer.appendChild(wishlistItem);
    });
    
    // Add event listeners to wishlist buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            
            // Add to cart
            addToCart({
                id: id,
                name: name,
                price: price,
                preview: image
            });
            
            alert(`${name} added to cart!`);
        });
    });
    
    document.querySelectorAll('.remove-from-wishlist').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            removeFromWishlist(id);
        });
    });
}

// Function to add to cart (copied from content.js)
function addToCart(product) {
    console.log('Adding to cart:', product);
    
    // Get existing cart items from localStorage
    let cart = [];
    try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            cart = JSON.parse(cartData);
        }
    } catch (error) {
        console.error('Error parsing cart data:', error);
        cart = [];
    }
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
        // If product exists, increase quantity
        cart[existingItemIndex].quantity += 1;
        console.log('Increased quantity for existing item');
    } else {
        // Add new item with quantity 1
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.preview,
            quantity: 1
        });
        console.log('Added new item to cart');
    }
    
    // Save to localStorage
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Cart saved to localStorage:', cart);
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
    
    // Update cart count
    updateCartCount();
}

// Function to update cart count
function updateCartCount() {
    let count = 0;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    cart.forEach(item => {
        count += item.quantity || 1;
    });
    
    // Update badge
    const badge = document.getElementById('badge');
    if (badge) {
        badge.textContent = count;
    }
}

// Function to remove from wishlist
function removeFromWishlist(id) {
    // Get wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Remove item from wishlist
    wishlist = wishlist.filter(item => item.id !== id);
    
    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Reload wishlist
    loadWishlist();
}

// Add CSS styles for modal
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .modal-content {
        background-color: white;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    
    .modal-header {
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
    }
    
    .modal-header h3 {
        margin: 0;
        font-size: 20px;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #555;
    }
    
    .modal-body {
        padding: 20px;
        overflow-y: auto;
    }
    
    .order-info {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 20px;
    }
    
    .order-info-item {
        flex: 1;
        min-width: 200px;
        margin-bottom: 10px;
    }
    
    .order-info-item span:first-child {
        font-weight: 500;
        margin-right: 5px;
    }
    
    .order-items-section, .order-summary-section {
        margin-top: 20px;
    }
    
    .order-items-section h4, .order-summary-section h4 {
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 15px;
    }
    
    .order-items-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .order-detail-item {
        display: flex;
        padding: 10px;
        background-color: #f9f9f9;
        border-radius: 4px;
    }
    
    .order-detail-item img {
        width: 70px;
        height: 70px;
        object-fit: cover;
        border-radius: 4px;
        margin-right: 15px;
    }
    
    .item-details h5 {
        margin: 0 0 5px;
    }
    
    .item-details p {
        margin: 3px 0;
        font-size: 14px;
    }
    
    .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    
    .summary-item.total {
        font-weight: bold;
        font-size: 18px;
        margin-top: 15px;
        padding-top: 10px;
        border-top: 1px solid #eee;
    }
    
    .processing {
        color: #ff9800;
    }
    
    .delivered {
        color: #4caf50;
    }
    
    .cancelled {
        color: #f44336;
    }
    
    .shipped {
        color: #2196f3;
    }
    
    @media (max-width: 768px) {
        .order-detail-item {
            flex-direction: column;
        }
        
        .order-detail-item img {
            margin-bottom: 10px;
            margin-right: 0;
            width: 100%;
            height: auto;
            max-height: 150px;
        }
    }
`;

document.head.appendChild(modalStyles);
