const books = [
    { id: 1, title: "Book One", author: "Author A", price: 9.99 },
    { id: 2, title: "Book Two", author: "Author B", price: 12.99 },
    { id: 3, title: "Book Three", author: "Author C", price: 8.99 },
    { id: 4, title: "Book Four", author: "Author D", price: 15.99 },
    { id: 5, title: "Book Five", author: "Author E", price: 11.99 },
    { id: 6, title: "Book Six", author: "Author F", price: 7.99 }
];

let cart = [];

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    cart.push(book);
    updateCartCount();
}

function removeFromCart(bookId) {
    cart = cart.filter(b => b.id !== bookId);
    updateCartCount();
}

function showBooks() {
    const grid = document.getElementById('book-grid');
    if (!grid) return;
    
    grid.innerHTML = books.map(book => `
        <div class="book">
            <h3>${book.title}</h3>
            <p>by ${book.author}</p>
            <p>$${book.price}</p>
            <button onclick="location.href='details.html?id=${book.id}'">Details</button>
            <button onclick="addToCart(${book.id})">Add to Cart</button>
        </div>
    `).join('');
}

function showBookDetails() {
    const params = new URLSearchParams(window.location.search);
    const bookId = parseInt(params.get('id'));
    const book = books.find(b => b.id === bookId);
    const details = document.getElementById('book-details');
    
    if (!details || !book) return;
    
    const inCart = cart.some(b => b.id === bookId);
    
    details.innerHTML = `
        <h2>${book.title}</h2>
        <p>Author: ${book.author}</p>
        <p>Price: $${book.price}</p>
        ${inCart ? 
            `<button onclick="removeFromCart(${book.id}); location.reload()">Remove from Cart</button>` :
            `<button onclick="addToCart(${book.id}); location.reload()">Add to Cart</button>`
        }
    `;
}

if (document.getElementById('book-grid')) {
    showBooks();
} else if (document.getElementById('book-details')) {
    showBookDetails();
}

updateCartCount();
