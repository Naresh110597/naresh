// Book data
const books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 12.99,
        image: "download.jpg",
        description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
        stock: 15,
        category: "Classic Literature",
        rating: 4.5,
        isbn: "978-0-7432-7356-5"
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 14.99,
        image: "download.jpg",
        description: "A gripping tale of racial injustice and childhood innocence in the American South.",
        stock: 12,
        category: "Classic Literature",
        rating: 4.8,
        isbn: "978-0-06-112008-4"
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        price: 13.99,
        image: "images (2).jpg",
        description: "A dystopian social science fiction novel about totalitarianism and surveillance.",
        stock: 20,
        category: "Science Fiction",
        rating: 4.6,
        isbn: "978-0-452-28423-4"
    },
    {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        price: 11.99,
        image: "images (3).jpg",
        description: "A romantic novel of manners exploring issues of marriage, money, and social status.",
        stock: 18,
        category: "Romance",
        rating: 4.7,
        isbn: "978-0-14-143951-8"
    },
    {
        id: 5,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        price: 13.50,
        image: "images (4).jpg",
        description: "A coming-of-age story about teenage rebellion and alienation in New York City.",
        stock: 10,
        category: "Coming of Age",
        rating: 4.3,
        isbn: "978-0-316-76948-0"
    },
    {
        id: 6,
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        price: 15.99,
        image: "images.jpg",
        description: "The magical beginning of Harry Potter's journey at Hogwarts School of Witchcraft and Wizardry.",
        stock: 25,
        category: "Fantasy",
        rating: 4.9,
        isbn: "978-0-439-70818-8"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let purchasedBooks = JSON.parse(localStorage.getItem('purchasedBooks')) || [];

// DOM elements
const cartCount = document.getElementById('cartCount');
const cartBtn = document.getElementById('cartBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const booksGrid = document.getElementById('booksGrid');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadBooks();
    setupEventListeners();
});

// Event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page) {
                showPage(page);
                updateActiveNav(this);
            }
        });
    });

    // Cart button
    cartBtn.addEventListener('click', function() {
        showPage('cart');
    });

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        const icon = this.querySelector('i');
        icon.className = mobileMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    });

    // Checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processOrder();
        });
    }
}

// Navigation functions
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Load page-specific content
    switch(pageName) {
        case 'cart':
            loadCartPage();
            break;
        case 'checkout':
            loadCheckoutPage();
            break;
        case 'home':
            loadBooks();
            break;
    }

    // Close mobile menu
    mobileMenu.classList.remove('active');
    const mobileMenuIcon = mobileMenuBtn.querySelector('i');
    mobileMenuIcon.className = 'fas fa-bars';
}

function updateActiveNav(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    if (activeLink.classList.contains('nav-link')) {
        activeLink.classList.add('active');
    }
}

// Book functions
function loadBooks() {
    const availableBooks = books.filter(book => !purchasedBooks.includes(book.id));
    
    if (availableBooks.length === 0) {
        booksGrid.innerHTML = `
            <div class="empty-cart" style="grid-column: 1 / -1;">
                <i class="fas fa-book-open"></i>
                <h2>No books available</h2>
                <p>Check back soon for new arrivals!</p>
            </div>
        `;
        return;
    }

    booksGrid.innerHTML = availableBooks.map(book => `
        <div class="book-card">
            <img src="${book.image}" alt="${book.title}" class="book-image">
            <div class="book-info">
                <div class="book-category">${book.category}</div>
                <div class="book-rating">
                    ${generateStars(book.rating)}
                    <span>${book.rating}</span>
                </div>
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <p class="book-description">${book.description}</p>
                <div class="book-footer">
                    <span class="book-price">$${book.price}</span>
                    <div class="book-actions">
                        <button class="btn btn-secondary" onclick="showBookDetails(${book.id})">
                            View Details
                        </button>
                        <button class="btn btn-primary" onclick="addToCart(${book.id})" ${book.stock <= 0 ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                    </div>
                </div>
                ${book.stock <= 5 ? `<div class="stock-info stock-low">Only ${book.stock} left in stock!</div>` : ''}
                ${book.stock <= 0 ? `<div class="stock-info stock-out">Out of stock</div>` : ''}
            </div>
        </div>
    `).join('');
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt star"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star star"></i>';
    }
    
    return stars;
}

function showBookDetails(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const bookDetailsContent = document.getElementById('bookDetailsContent');
    const bookTitle = document.getElementById('bookTitle');
    
    bookTitle.textContent = book.title;
    
    bookDetailsContent.innerHTML = `
        <div class="book-details-content">
            <div class="book-details-image">
                <img src="${book.image}" alt="${book.title}">
            </div>
            <div class="book-details-info">
                <div class="book-category">${book.category}</div>
                <h1>${book.title}</h1>
                <p class="book-details-author">by ${book.author}</p>
                
                <div class="book-rating">
                    ${generateStars(book.rating)}
                    <span>${book.rating} / 5</span>
                    <span style="margin-left: 1rem; color: #6b7280;">ISBN: ${book.isbn}</span>
                </div>
                
                <p class="book-details-description">${book.description}</p>
                
                <div class="book-details-meta">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                        <div>
                            <span class="book-price" style="font-size: 2rem;">$${book.price}</span>
                            <div class="stock-info" style="margin-top: 0.5rem;">
                                ${book.stock > 0 ? 
                                    `<span style="color: #10b981;">✓ In stock (${book.stock} available)</span>` : 
                                    `<span style="color: #ef4444;">✗ Out of stock</span>`
                                }
                            </div>
                        </div>
                    </div>
                    
                    <div class="quantity-selector">
                        <label for="quantity">Quantity:</label>
                        <select id="quantity">
                            ${Array.from({length: Math.min(book.stock, 10)}, (_, i) => 
                                `<option value="${i + 1}">${i + 1}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="book-actions-large">
                        <button class="btn btn-primary" onclick="addToCartWithQuantity(${book.id})" ${book.stock <= 0 ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        <button class="btn btn-secondary">
                            <i class="fas fa-heart"></i>
                            Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 2rem; padding: 2rem; background: #f9fafb; border-radius: 1rem;">
            <h2 style="margin-bottom: 2rem;">Additional Information</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div>
                    <h3 style="margin-bottom: 1rem; color: #374151;">Book Details</h3>
                    <div style="display: grid; gap: 0.5rem;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Category:</span>
                            <span style="font-weight: 600;">${book.category}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">ISBN:</span>
                            <span style="font-weight: 600;">${book.isbn}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Stock:</span>
                            <span style="font-weight: 600;">${book.stock} copies</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Rating:</span>
                            <span style="font-weight: 600;">${book.rating} / 5</span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 style="margin-bottom: 1rem; color: #374151;">Shipping Information</h3>
                    <ul style="list-style: none; color: #6b7280; line-height: 1.8;">
                        <li>• Free shipping on orders over $25</li>
                        <li>• Standard delivery: 3-5 business days</li>
                        <li>• Express delivery: 1-2 business days</li>
                        <li>• International shipping available</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    showPage('bookDetails');
}

// Cart functions
function addToCart(bookId, quantity = 1) {
    const book = books.find(b => b.id === bookId);
    if (!book || book.stock <= 0) return;

    const existingItem = cart.find(item => item.bookId === bookId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ bookId, quantity });
    }
    
    saveCart();
    updateCartCount();
    
    // Show success message
    showNotification(`"${book.title}" added to cart!`);
}

function addToCartWithQuantity(bookId) {
    const quantitySelect = document.getElementById('quantity');
    const quantity = parseInt(quantitySelect.value);
    addToCart(bookId, quantity);
}

function removeFromCart(bookId) {
    cart = cart.filter(item => item.bookId !== bookId);
    saveCart();
    updateCartCount();
    loadCartPage();
}

function updateQuantity(bookId, newQuantity) {
    const item = cart.find(item => item.bookId === bookId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(bookId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartCount();
            loadCartPage();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

function getCartTotal() {
    return cart.reduce((sum, item) => {
        const book = books.find(b => b.id === item.bookId);
        return sum + (book ? book.price * item.quantity : 0);
    }, 0);
}

function loadCartPage() {
    const cartContent = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any books to your cart yet.</p>
                <button class="btn btn-primary" onclick="showPage('home')">Continue Shopping</button>
            </div>
        `;
        return;
    }

    const subtotal = getCartTotal();
    const shipping = subtotal >= 25 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    cartContent.innerHTML = `
        <div class="cart-items">
            <div class="cart-header">
                <h2>Cart Items (${cart.reduce((sum, item) => sum + item.quantity, 0)})</h2>
            </div>
            ${cart.map(item => {
                const book = books.find(b => b.id === item.bookId);
                if (!book) return '';
                
                return `
                    <div class="cart-item">
                        <img src="${book.image}" alt="${book.title}" class="cart-item-image">
                        <div class="cart-item-info">
                            <h3 class="cart-item-title">${book.title}</h3>
                            <p class="cart-item-author">by ${book.author}</p>
                            <p style="color: #6b7280; font-size: 0.875rem;">${book.category}</p>
                            
                            <div class="cart-item-controls">
                                <div class="quantity-controls">
                                    <label>Qty:</label>
                                    <select onchange="updateQuantity(${book.id}, parseInt(this.value))">
                                        ${Array.from({length: Math.min(book.stock, 10)}, (_, i) => 
                                            `<option value="${i + 1}" ${item.quantity === i + 1 ? 'selected' : ''}>${i + 1}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                
                                <div style="text-align: right;">
                                    <div class="cart-item-price">$${(book.price * item.quantity).toFixed(2)}</div>
                                    <div style="font-size: 0.875rem; color: #6b7280;">$${book.price} each</div>
                                </div>
                            </div>
                            
                            <button class="remove-btn" onclick="removeFromCart(${book.id})">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        
        <div class="cart-summary">
            <h2>Order Summary</h2>
            
            <div class="summary-row">
                <span>Subtotal (${cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            
            ${subtotal < 25 ? `
                <div style="margin: 1rem 0; padding: 1rem; background: #eff6ff; border-radius: 0.5rem; color: #1e40af; font-size: 0.875rem;">
                    Add $${(25 - subtotal).toFixed(2)} more for free shipping!
                </div>
            ` : ''}
            
            <button class="btn btn-primary btn-full" onclick="showPage('checkout')" style="margin-bottom: 1rem;">
                Proceed to Checkout
            </button>
            
            <button class="btn btn-secondary btn-full" onclick="showPage('home')">
                Continue Shopping
            </button>
        </div>
    `;
}

function loadCheckoutPage() {
    const checkoutSummary = document.getElementById('checkoutSummary');
    
    if (cart.length === 0) {
        showPage('cart');
        return;
    }

    const subtotal = getCartTotal();
    const shipping = subtotal >= 25 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    checkoutSummary.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            ${cart.map(item => {
                const book = books.find(b => b.id === item.bookId);
                if (!book) return '';
                
                return `
                    <div class="checkout-item">
                        <img src="${book.image}" alt="${book.title}" class="checkout-item-image">
                        <div class="checkout-item-info">
                            <div class="checkout-item-title">${book.title}</div>
                            <div class="checkout-item-author">by ${book.author}</div>
                            <div class="checkout-item-details">
                                <span>Qty: ${item.quantity}</span>
                                <span>$${(book.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 1rem;">
            <div class="summary-row">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        </div>
    `;
}

function processOrder() {
    // Simulate order processing
    const submitBtn = document.querySelector('#checkoutForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    setTimeout(() => {
        // Mark books as purchased (hide from homepage)
        const purchasedBookIds = cart.map(item => item.bookId);
        purchasedBooks.push(...purchasedBookIds);
        localStorage.setItem('purchasedBooks', JSON.stringify(purchasedBooks));
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartCount();
        
        // Show success modal
        showSuccessModal();
        
        // Reset form
        document.getElementById('checkoutForm').reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
    }, 2000);
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
    showPage('home');
}

// Utility functions
function scrollToBooks() {
    document.getElementById('featuredBooks').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeModal();
    }
});