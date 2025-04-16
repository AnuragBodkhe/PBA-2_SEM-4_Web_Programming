console.clear();

let contentTitle;

console.log(document.cookie);

// Function to add item to cart
function addToCart(productId) {
    let cookies = document.cookie.split(';');
    let cartItems = [];
    
    // Get existing cart items
    cookies.forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name === 'items') {
            cartItems = value ? value.split(' ').filter(Boolean) : [];
        }
    });
    
    // Add new item
    cartItems.push(productId);
    
    // Set expiry to 7 days
    const date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    
    // Update cookies
    document.cookie = `items=${cartItems.join(' ')}${expires}; path=/`;
    document.cookie = `counter=${cartItems.length}${expires}; path=/`;
    
    // Update cart badge
    const badge = document.getElementById("badge");
    if (badge) {
        badge.innerHTML = cartItems.length;
    }
    
    // Show confirmation message
    alert('Item added to cart!');
}

// Function to create product card
function createProductCard(ob) {
    let boxDiv = document.createElement('div');
    boxDiv.className = 'box';
    boxDiv.id = ob.id;

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
        addToCart(ob.id);
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

// Add CSS for Add to Cart button
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
`;

document.head.appendChild(styles);
