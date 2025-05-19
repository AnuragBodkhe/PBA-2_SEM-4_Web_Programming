console.clear();

let contentTitle;

console.log(document.cookie);

// Function to add item to cart
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
    
    // Show confirmation message
    alert(`${product.name} added to cart!`);
}

// Function to add item to wishlist
function addToWishlist(product) {
    // Get existing wishlist items from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Check if product already exists in wishlist
    const existingItem = wishlist.find(item => item.id === product.id);
    
    if (existingItem) {
        // If product exists, show message
        alert(`${product.name} is already in your wishlist!`);
        return;
    }
    
    // Add new item to wishlist
    wishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.preview
    });
    
    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Show confirmation message
    alert(`${product.name} added to wishlist!`);
    
    // Update wishlist icon
    updateWishlistIcon(product.id);
}

// Function to remove item from wishlist
function removeFromWishlist(productId) {
    // Get existing wishlist items from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Remove the item
    wishlist = wishlist.filter(item => item.id !== productId);
    
    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Update wishlist icon
    updateWishlistIcon(productId);
}

// Function to update cart count
function updateCartCount() {
    console.log('Updating cart count');
    let count = 0;
    
    try {
        // Get cart items from localStorage
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            const cart = JSON.parse(cartData);
            
            // Calculate total quantity
            cart.forEach(item => {
                count += item.quantity;
            });
            
            console.log('Cart count calculated:', count);
        }
    } catch (error) {
        console.error('Error calculating cart count:', error);
    }
    
    // Update badge in header
    const badge = document.getElementById('badge');
    if (badge) {
        badge.textContent = count;
        console.log('Badge updated with count:', count);
    } else {
        console.log('Badge element not found, will update on next page load');
    }
    
    // Store cart count in localStorage for persistence across pages
    localStorage.setItem('cartCount', count);
    console.log('Cart count saved to localStorage:', count);
}

// Function to check if product is in wishlist
function isInWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlist.some(item => item.id === productId);
}

// Function to update wishlist icon
function updateWishlistIcon(productId) {
    const wishlistBtn = document.querySelector(`.wishlist-btn[data-id="${productId}"]`);
    if (wishlistBtn) {
        if (isInWishlist(productId)) {
            wishlistBtn.classList.add('in-wishlist');
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            wishlistBtn.classList.remove('in-wishlist');
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
        }
    }
}

// Function to create product card
function createProductCard(ob) {
    let boxDiv = document.createElement('div');
    boxDiv.className = 'box';
    boxDiv.id = ob.id;

    // Wishlist button
    let wishlistBtn = document.createElement('button');
    wishlistBtn.className = 'wishlist-btn';
    wishlistBtn.setAttribute('data-id', ob.id);
    wishlistBtn.innerHTML = isInWishlist(ob.id) ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    if (isInWishlist(ob.id)) wishlistBtn.classList.add('in-wishlist');
    
    wishlistBtn.onclick = function(e) {
        e.stopPropagation();
        if (isInWishlist(ob.id)) {
            removeFromWishlist(ob.id);
        } else {
            addToWishlist(ob);
        }
    };
    boxDiv.appendChild(wishlistBtn);

    let boxLink = document.createElement('a');
    boxLink.href = 'contentDetails.html?id=' + ob.id;
    boxDiv.appendChild(boxLink);

    let boxImg = document.createElement('img');
    boxImg.src = ob.preview;
    boxImg.alt = ob.name;
    boxLink.appendChild(boxImg);

    let detailsDiv = document.createElement('div');
    detailsDiv.id = 'details';
    boxLink.appendChild(detailsDiv);

    let boxh3 = document.createElement('h3');
    boxh3.textContent = ob.name;
    detailsDiv.appendChild(boxh3);

    let boxh4 = document.createElement('h4');
    boxh4.textContent = ob.brand;
    detailsDiv.appendChild(boxh4);

    let boxh2 = document.createElement('h2');
    boxh2.textContent = 'Rs ' + ob.price;
    detailsDiv.appendChild(boxh2);

    // Add to Cart button
    let addToCartBtn = document.createElement('button');
    addToCartBtn.className = 'add-to-cart-btn';
    addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
    addToCartBtn.onclick = function(e) {
        e.preventDefault(); // Prevent navigation to product details
        addToCart(ob);
    };
    boxDiv.appendChild(addToCartBtn);

    return boxDiv;
}

// Function to filter clothing items
function filterClothingItems(items) {
    return items.filter(item => item.isAccessory === false);
}

// Function to filter accessories
function filterAccessories(items) {
    return items.filter(item => item.isAccessory === true);
}

// Function to render products
function renderProducts(items, containerId, isAccessory = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filteredItems = items.filter(item => item.isAccessory === isAccessory);
    
    // If on index page, only show first 8 items
    const itemsToShow = window.location.pathname.includes('index.html') ? 
        filteredItems.slice(0, 8) : filteredItems;

    itemsToShow.forEach(item => {
        const productCard = createProductCard(item);
        container.appendChild(productCard);
    });
}

// Fetch products and render
let httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function() {
    if(this.readyState === 4) {
        if(this.status === 200) {
            const items = JSON.parse(this.responseText);
            
            // Check which page we're on
            const path = window.location.pathname;
            if (path.includes('index.html') || path.endsWith('/')) {
                // On index page, show featured products
                renderProducts(items, 'content', false); // Show clothing items
            } else if (path.includes('clothing.html')) {
                // On clothing page
                renderProducts(items, 'containerClothing', false);
            } else if (path.includes('accessories.html')) {
                // On accessories page
                renderProducts(items, 'containerAccessories', true);
            }
        } else {
            console.error('Failed to fetch products');
        }
    }
};

httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product', true);
httpRequest.send();

// Add CSS for buttons
const styles = document.createElement('style');
styles.textContent = `
    .box {
        position: relative;
        padding-bottom: 50px; /* Make space for the button */
    }
    
    .add-to-cart-btn {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: #1e88e5;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: 'Poppins', sans-serif;
        transition: all 0.3s ease;
        z-index: 1;
    }
    
    .add-to-cart-btn:hover {
        background: #1565c0;
        transform: translateX(-50%) scale(1.05);
    }
    
    .add-to-cart-btn:active {
        transform: translateX(-50%) scale(0.95);
    }
    
    .add-to-cart-btn i {
        font-size: 16px;
    }
    
    /* Wishlist button styles */
    .wishlist-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 255, 255, 0.8);
        color: #888;
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 2;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    .wishlist-btn:hover {
        background: white;
        transform: scale(1.1);
    }
    
    .wishlist-btn.in-wishlist {
        color: #e91e63;
    }
    
    .wishlist-btn i {
        font-size: 18px;
    }
`;

document.head.appendChild(styles);

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});
