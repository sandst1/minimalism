// E-book data
const books = [
    {
        id: 1,
        title: "The Digital Revolution",
        author: "Dr. Sarah Chen",
        category: "technology",
        price: 19.99,
        rating: 4.8,
        description: "Explore the transformative impact of digital technology on society, business, and human interaction. This comprehensive guide takes you through the evolution of digital systems and their profound effects on our daily lives.",
        featured: true
    },
    {
        id: 2,
        title: "Mindful Leadership",
        author: "James Morrison",
        category: "business",
        price: 24.99,
        rating: 4.6,
        description: "Discover the power of mindful leadership in creating positive organizational change. Learn practical techniques for managing teams, making decisions, and fostering innovation through conscious leadership practices.",
        featured: true
    },
    {
        id: 3,
        title: "Quantum Physics Simplified",
        author: "Prof. Michael Roberts",
        category: "science",
        price: 29.99,
        rating: 4.9,
        description: "A clear and accessible introduction to quantum physics for the curious mind. Breaking down complex concepts into understandable explanations, this book makes quantum mechanics approachable for everyone.",
        featured: true
    },
    {
        id: 4,
        title: "The Art of Storytelling",
        author: "Emma Watson",
        category: "fiction",
        price: 16.99,
        rating: 4.7,
        description: "Master the craft of storytelling with this comprehensive guide. Learn techniques used by successful authors to create compelling narratives that captivate readers from beginning to end."
    },
    {
        id: 5,
        title: "Sustainable Living Guide",
        author: "Dr. Green Thompson",
        category: "non-fiction",
        price: 22.99,
        rating: 4.5,
        description: "A practical handbook for living sustainably in the modern world. Discover simple changes you can make to reduce your environmental impact while saving money and improving your quality of life."
    },
    {
        id: 6,
        title: "Machine Learning Fundamentals",
        author: "Dr. Alex Kim",
        category: "technology",
        price: 34.99,
        rating: 4.8,
        description: "Start your journey into machine learning with this beginner-friendly guide. Covers essential algorithms, practical applications, and hands-on examples to get you building your first ML models."
    },
    {
        id: 7,
        title: "Creative Writing Workshop",
        author: "Maya Rodriguez",
        category: "fiction",
        price: 18.99,
        rating: 4.4,
        description: "Unlock your creative potential with exercises and techniques from a master storyteller. Perfect for aspiring writers looking to develop their voice and craft compelling stories."
    },
    {
        id: 8,
        title: "Financial Freedom Blueprint",
        author: "Robert Stevens",
        category: "business",
        price: 26.99,
        rating: 4.7,
        description: "A step-by-step guide to achieving financial independence. Learn proven strategies for budgeting, investing, and building wealth that can set you on the path to financial freedom."
    },
    {
        id: 9,
        title: "The Psychology of Happiness",
        author: "Dr. Lisa Park",
        category: "non-fiction",
        price: 21.99,
        rating: 4.6,
        description: "Discover the science behind happiness and well-being. This research-based book provides practical insights into cultivating joy, resilience, and meaningful relationships."
    },
    {
        id: 10,
        title: "Space Exploration Chronicles",
        author: "Commander John Hayes",
        category: "science",
        price: 27.99,
        rating: 4.9,
        description: "Journey through the history and future of space exploration. From the first satellites to Mars missions and beyond, explore humanity's greatest adventure."
    },
    {
        id: 11,
        title: "Entrepreneurship Essentials",
        author: "Victoria Chang",
        category: "business",
        price: 23.99,
        rating: 4.5,
        description: "Everything you need to know about starting and growing a successful business. From idea validation to scaling operations, this comprehensive guide covers it all."
    },
    {
        id: 12,
        title: "Climate Change Solutions",
        author: "Dr. Environmental Smith",
        category: "science",
        price: 25.99,
        rating: 4.7,
        description: "Understand the climate crisis and discover actionable solutions. This book presents both the challenge of climate change and the innovative technologies and policies addressing it."
    }
];

// Shopping cart
let cart = JSON.parse(localStorage.getItem('bookstore-cart')) || [];

// Current page and selected book
let currentPage = 'home';
let selectedBook = null;

// DOM elements
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartContent = document.getElementById('cartContent');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    renderFeaturedBooks();
    renderAllBooks();
    setupEventListeners();
    setupNavigation();
});

// Event listeners
function setupEventListeners() {
    // Cart sidebar
    cartBtn.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartSidebar);
    overlay.addEventListener('click', closeCartSidebar);
    
    // Filters
    categoryFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
    
    // Checkout
    checkoutBtn.addEventListener('click', handleCheckout);
}

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
        });
    });
}

function showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show selected page
    document.getElementById(page + 'Page').classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });
    
    currentPage = page;
    
    // Close cart if open
    closeCartSidebar();
}

// Book rendering
function renderFeaturedBooks() {
    const featuredBooks = books.filter(book => book.featured);
    const container = document.getElementById('featuredBooks');
    container.innerHTML = featuredBooks.map(book => createBookCard(book)).join('');
}

function renderAllBooks() {
    const container = document.getElementById('allBooks');
    container.innerHTML = books.map(book => createBookCard(book)).join('');
}

function createBookCard(book) {
    const isInCart = cart.some(item => item.id === book.id);
    const stars = '★'.repeat(Math.floor(book.rating)) + '☆'.repeat(5 - Math.floor(book.rating));
    
    return `
        <div class="book-card" onclick="showBookDetails(${book.id})">
            <div class="book-cover">
                <i class="fas fa-book"></i>
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <span class="book-category">${book.category}</span>
                <div class="book-rating">
                    <span class="stars">${stars}</span>
                    <span>(${book.rating})</span>
                </div>
                <div class="book-price">$${book.price.toFixed(2)}</div>
                <button class="add-to-cart" 
                        onclick="event.stopPropagation(); addToCart(${book.id})"
                        ${isInCart ? 'disabled' : ''}>
                    ${isInCart ? 'In Cart' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `;
}

// Book details
function showBookDetails(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    selectedBook = book;
    const isInCart = cart.some(item => item.id === book.id);
    const stars = '★'.repeat(Math.floor(book.rating)) + '☆'.repeat(5 - Math.floor(book.rating));
    
    const detailsContent = document.getElementById('bookDetailsContent');
    detailsContent.innerHTML = `
        <div class="book-details-cover">
            <i class="fas fa-book"></i>
        </div>
        <div class="book-details-info">
            <h1>${book.title}</h1>
            <p class="author">by ${book.author}</p>
            <span class="category">${book.category}</span>
            <div class="rating">
                <span class="stars">${stars}</span>
                <span>(${book.rating})</span>
            </div>
            <div class="price">$${book.price.toFixed(2)}</div>
            <p class="description">${book.description}</p>
            <button class="add-to-cart" 
                    onclick="addToCart(${book.id})"
                    ${isInCart ? 'disabled' : ''}>
                ${isInCart ? 'Already in Cart' : 'Add to Cart'}
            </button>
        </div>
    `;
    
    showPage('bookDetails');
}

// Filtering and sorting
function applyFilters() {
    const category = categoryFilter.value;
    const sort = sortFilter.value;
    
    let filteredBooks = books;
    
    // Apply category filter
    if (category) {
        filteredBooks = filteredBooks.filter(book => book.category === category);
    }
    
    // Apply sorting
    filteredBooks.sort((a, b) => {
        switch (sort) {
            case 'price':
                return a.price - b.price;
            case 'rating':
                return b.rating - a.rating;
            case 'title':
            default:
                return a.title.localeCompare(b.title);
        }
    });
    
    // Render filtered books
    const container = document.getElementById('allBooks');
    container.innerHTML = filteredBooks.map(book => createBookCard(book)).join('');
}

// Shopping cart functionality
function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    // Check if book is already in cart
    if (cart.some(item => item.id === bookId)) {
        return;
    }
    
    cart.push({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price
    });
    
    saveCart();
    updateCartUI();
    
    // Update the current page's buttons
    updateBookCards();
    
    // Show a brief feedback
    showAddToCartFeedback();
}

function removeFromCart(bookId) {
    cart = cart.filter(item => item.id !== bookId);
    saveCart();
    updateCartUI();
    updateBookCards();
}

function updateCartUI() {
    // Update cart count
    cartCount.textContent = cart.length;
    
    // Update cart content
    if (cart.length === 0) {
        cartContent.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotal.textContent = '0.00';
        checkoutBtn.disabled = true;
    } else {
        cartContent.innerHTML = cart.map(item => createCartItem(item)).join('');
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = total.toFixed(2);
        checkoutBtn.disabled = false;
    }
}

function createCartItem(item) {
    return `
        <div class="cart-item">
            <div class="cart-item-cover">
                <i class="fas fa-book"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-author">by ${item.author}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

function updateBookCards() {
    // Re-render all book grids to update button states
    renderFeaturedBooks();
    renderAllBooks();
    
    // Update book details page if currently viewing one
    if (currentPage === 'bookDetails' && selectedBook) {
        showBookDetails(selectedBook.id);
    }
}

function openCart() {
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function saveCart() {
    localStorage.setItem('bookstore-cart', JSON.stringify(cart));
}

function handleCheckout() {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    alert(`Thank you for your purchase!\n\nItems: ${cart.length}\nTotal: $${total.toFixed(2)}\n\nYour e-books will be available for download shortly.`);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartUI();
    updateBookCards();
    closeCartSidebar();
}

function showAddToCartFeedback() {
    // Create a temporary feedback element
    const feedback = document.createElement('div');
    feedback.textContent = 'Added to cart!';
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #059669;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(feedback);
    
    // Remove after 2 seconds
    setTimeout(() => {
        feedback.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(feedback);
            document.head.removeChild(style);
        }, 300);
    }, 2000);
}

// Search functionality (bonus feature)
function searchBooks(query) {
    if (!query) return books;
    
    const searchTerm = query.toLowerCase();
    return books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.category.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm)
    );
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press 'c' to toggle cart
    if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
        if (cartSidebar.classList.contains('open')) {
            closeCartSidebar();
        } else {
            openCart();
        }
    }
    
    // Press 'Escape' to close cart
    if (e.key === 'Escape') {
        closeCartSidebar();
    }
});

// Make functions globally available
window.showPage = showPage;
window.showBookDetails = showBookDetails;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;

