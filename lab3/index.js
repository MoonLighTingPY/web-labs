class Book {
    constructor(title, author, pages, price) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.price = price;
    }
}

let fetchedBooks = [];

function displayBooks(fetchedBooks) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    fetchedBooks.forEach((book, index) => {
        bookList.insertAdjacentHTML('beforeend', `
            <div class="book-card">
                <h3>${book.title}</h3>
                <p>by ${book.author}</p>
                <p>${book.pages} pages</p>
                <p class="price">${book.price} UAH</p>
                <button onclick="editBook(${index})">Edit</button>
                <button onclick="deleteBook(${index})">Delete</button>
            </div>
        `);
    });
}

async function fetchBooks() {
    const response = await fetch('http://localhost:5500/lab3/books/books.json');
    const data = await response.json();
    fetchedBooks = data;
    console.log(fetchedBooks); // Add this line to check the structure
    displayBooks(fetchedBooks);
}

function searchBooks() {
    const query = document.getElementById('search').value.toLowerCase();
    const filteredBooks = fetchedBooks.filter(book => book.title.toLowerCase().includes(query));
    displayBooks(filteredBooks);
}


function clearSearch() {
    document.getElementById('search').value = '';
    displayBooks(fetchedBooks);
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

function sortBooks(criteria) {
    fetchedBooks.sort((a, b) => {
        if (criteria === 'author') {
            return a.author.localeCompare(b.author);
        } else if (criteria === 'price') {
            return a.price - b.price;
        } else if (criteria === 'pages') {
            return a.pages - b.pages;
        }
    });
    displayBooks(fetchedBooks);
}

function toggleCreateBookModal(isEdit = false, index = null) {
    console.log('toggleCreateBookModal called');
    const modal = document.getElementById('create-book-modal');
    const form = document.getElementById('create-book-form');
    const modalTitle = modal.querySelector('h2');
    const submitButton = form.querySelector('button[type="submit"]');

    if (isEdit) {
        console.log('Setting form onsubmit to updateBook');
        form.onsubmit = function(event) {
            updateBook(event, index);
        };
        modalTitle.textContent = 'Edit Book';
        submitButton.textContent = 'Update Book';
    } else {
        console.log('Setting form onsubmit to createBook');
        form.onsubmit = createBook;
        modalTitle.textContent = 'Create New Book';
        submitButton.textContent = 'Create Book';
    }

    console.log('Modal before toggle:', modal.classList);
    modal.classList.toggle('show-modal');
    console.log('Modal after toggle:', modal.classList);
}

async function createBook(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const price = document.getElementById('price').value;

    const newBook = { title, author, pages: parseInt(pages), price: parseFloat(price) };

    console.log('Creating book:', newBook);

    try {
        const response = await fetch('http://localhost:3000/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBook)
        });

        if (!response.ok) {
            throw new Error(`Failed to create book: ${response.statusText}`);
        }

        const createdBook = await response.json();
        console.log('Created book:', createdBook);

        fetchedBooks.push(createdBook);
        displayBooks(fetchedBooks);
        toggleCreateBookModal();
        document.getElementById('create-book-form').reset();
    } catch (error) {
        console.error('Error creating book:', error);
    }
}

function editBook(index) {
    const book = fetchedBooks[index];
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('pages').value = book.pages;
    document.getElementById('price').value = book.price;

    toggleCreateBookModal(true, index);
}
async function updateBook(event, index) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const price = document.getElementById('price').value;

    const updatedBook = { title, author, pages: parseInt(pages), price: parseFloat(price) };
    const bookId = fetchedBooks[index].id;

    const response = await fetch(`http://localhost:5500/lab3/books/${bookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBook)
    });

    if (!response.ok) {
        console.error('Failed to update book:', response.statusText);
        return;
    }

    const updatedBookData = await response.json();
    fetchedBooks[index] = updatedBookData;
    displayBooks(fetchedBooks);
    toggleCreateBookModal();
    document.getElementById('create-book-form').reset();
}

async function deleteBook(index) {
    const bookId = fetchedBooks[index].id;

    const response = await fetch(`http://localhost:5500/lab3/books/${bookId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        console.error('Failed to delete book:', response.statusText);
        return;
    }

    fetchedBooks.splice(index, 1);
    displayBooks(fetchedBooks);
}
fetchBooks();

// Initial display
displayBooks(fetchedBooks);
