const apiUrl = 'http://localhost:3000/api/books'; // API endpoint

async function fetchBooks(queryParams = '') {
    const response = await fetch(apiUrl + queryParams);
    const books = await response.json();
    displayBooks(books);
}

function displayBooks(filteredBooks) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    filteredBooks.forEach(book => {
        bookList.insertAdjacentHTML('beforeend', `
            <div class="book-card">
                <h3>${book.title}</h3>
                <p>by ${book.author}</p>
                <p>${book.pages} pages</p>
                <p class="price">${book.price} UAH</p>
                <div class="button-group">
                    <button onclick="editBook('${book.title}')">Edit</button>
                    <button onclick="deleteBook('${book.title}')">Delete</button>
                </div>
            </div>
        `);
    });
    calculateTotalPrice(filteredBooks);
}

function calculateTotalPrice(filteredBooks) {
    const totalPrice = filteredBooks.reduce((sum, book) => sum + book.price, 0);
    document.getElementById('total-price').textContent = `${totalPrice} UAH`;
}

async function createBook(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const price = document.getElementById('price').value;

    const isEdit = document.getElementById('create-book-form').dataset.isEdit === 'true';
    const index = document.getElementById('create-book-form').dataset.editIndex;

    const newBook = { title, author, pages: parseInt(pages), price: parseFloat(price) };

    if (isEdit && index !== null) {
        await fetch(`${apiUrl}/${encodeURIComponent(title)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBook),
        });
    } else {
        await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBook),
        });
    }

    fetchBooks(); // Refresh the book list
    toggleCreateBookModal();
    document.getElementById('create-book-form').reset();
}

async function deleteBook(title) {
    await fetch(`${apiUrl}/${encodeURIComponent(title)}`, {
        method: 'DELETE',
    });
    fetchBooks(); // Refresh the book list
}

function editBook(title) {
    const bookCard = [...document.querySelectorAll('.book-card')].find(card => card.querySelector('h3').innerText === title);
    
    document.getElementById('title').value = title;
    document.getElementById('author').value = bookCard.querySelector('p').innerText.split('by ')[1];
    document.getElementById('pages').value = bookCard.querySelector('p:nth-child(3)').innerText.split(' ')[0];
    document.getElementById('price').value = bookCard.querySelector('.price').innerText.split(' ')[0];

    toggleCreateBookModal(true, title);
}

async function searchBooks() {
    const query = document.getElementById('search').value.trim().toLowerCase();
    const queryParams = query ? `?search=${encodeURIComponent(query)}` : '';
    fetchBooks(queryParams);
}

function clearSearch() {
    document.getElementById('search').value = '';
    fetchBooks();
}

function sortBooks(criteria) {
    const query = document.getElementById('search').value.trim().toLowerCase();
    const queryParams = `?sortBy=${criteria}${query ? `&search=${encodeURIComponent(query)}` : ''}`;
    fetchBooks(queryParams);
}

function toggleCreateBookModal(isEdit = false, title = '') {
    const modal = document.getElementById('create-book-modal');
    const modalTitle = document.querySelector('#create-book-modal h2');
    const submitButton = document.querySelector('#create-book-form .primary-btn');

    modal.classList.toggle('show-modal');

    if (isEdit) {
        document.getElementById('create-book-form').dataset.editIndex = title;
        document.getElementById('create-book-form').dataset.isEdit = true;
        modalTitle.textContent = `Edit Book: ${title}`;
        submitButton.textContent = 'Confirm';
    } else {
        document.getElementById('create-book-form').removeAttribute('data-edit-index');
        document.getElementById('create-book-form').removeAttribute('data-is-edit');
        modalTitle.textContent = 'Create New Book';
        submitButton.textContent = 'Create Book';
    }
}

// Initial display
fetchBooks();
