// Book class
class Book {
    constructor(pages, author, price) {
        this.pages = pages;
        this.author = author;
        this.price = price;
    }
}

// Initial set of books
let books = [
    new Book(300, 'Author A', 500),
    new Book(150, 'Author B', 200),
    new Book(450, 'Author C', 800),
    new Book(200, 'Author A', 350)
];

// Function to display all books
function displayBooks(bookArray) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    bookArray.forEach((book, index) => {
        bookList.insertAdjacentHTML('beforeend', `
            <div class="book">
                <h3>Book ${index + 1}</h3>
                <p>Author: ${book.author}</p>
                <p>Pages: ${book.pages}</p>
                <p>Price: ${book.price} UAH</p>
            </div>
            <hr>
        `);
    });
}

// Function to calculate total price of all books
function calculateTotalPrice() {
    const total = books.reduce((sum, book) => sum + book.price, 0);
    document.getElementById('total-price').innerText = total;
}

// Function to search books by author
function searchBooks() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const filteredBooks = books.filter(book => book.author.toLowerCase().includes(searchQuery));
    displayBooks(filteredBooks);
}

// Function to sort books
function sortBooks() {
    const sortOption = document.getElementById('sort').value;
    if (sortOption === 'price') {
        books.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'pages') {
        books.sort((a, b) => a.pages - b.pages);
    } else if (sortOption === 'author') {
        books.sort((a, b) => a.author.localeCompare(b.author));
    }
    displayBooks(books);
}

// Initial display and calculations
displayBooks(books);
calculateTotalPrice();
