class Book {
    constructor(title, author, pages, price) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.price = price;
    }
}

const books = [
    new Book('Book One', 'Author One', 200, 150),
    new Book('Book Two', 'Author Two', 300, 200),
    new Book('Book Three', 'Author Three', 250, 180),
];

function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    books.forEach((book, index) => {
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

  function editBook(index) {
    const book = books[index];
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('pages').value = book.pages;
    document.getElementById('price').value = book.price;
  
    toggleCreateBookModal(true, index);
  }
  
  function deleteBook(index) {
    books.splice(index, 1);
    displayBooks(books);
  }
  
function updateBook(event, index) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const price = document.getElementById('price').value;
  
    const updatedBook = new Book(title, author, parseInt(pages), parseFloat(price));
    books[index] = updatedBook;
    displayBooks(books);
    toggleCreateBookModal();
    document.getElementById('create-book-form').reset();
}

function searchBooks() {
    const query = document.getElementById('search').value.toLowerCase();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));
    displayBooks(filteredBooks);
}

function clearSearch() {
    document.getElementById('search').value = '';
    displayBooks(books);
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

function toggleCreateBookModal() {
    const modal = document.getElementById('create-book-modal');
    modal.classList.toggle('show-modal');
}

function createBook(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const price = document.getElementById('price').value;

    const newBook = new Book(title, author, parseInt(pages), parseFloat(price));
    books.push(newBook);
    displayBooks(books);
    toggleCreateBookModal();
    document.getElementById('create-book-form').reset();
}

function sortBooks(criteria) {
  switch (criteria) {
    case 'title':
      books.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'author':
      books.sort((a, b) => a.author.localeCompare(b.author));
      break;
    case 'price':
      books.sort((a, b) => a.price - b.price);
      break;
    case 'pages':
      books.sort((a, b) => a.pages - b.pages);
      break;
    default:
      return;
  }
  displayBooks(books);
}

// Initial display
displayBooks(books);
