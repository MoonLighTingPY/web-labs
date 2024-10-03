class Book {
  constructor(title, author, pages, price) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.price = price;
  }
}

let fetchedBooks = [
  new Book('To Kill a Mockingbird', 'Harper Lee', 281, 150),
  new Book('1984', 'George Orwell', 328, 200),
  new Book('The Great Gatsby', 'F. Scott Fitzgerald', 180, 120),
  new Book('The Catcher in the Rye', 'J.D. Salinger', 214, 130),
  new Book('Pride and Prejudice', 'Jane Austen', 279, 140)
];

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

function searchBooks() {
  const query = document.getElementById('search').value.toLowerCase();
  const filteredBooks = fetchedBooks.filter(book => book.title.toLowerCase().includes(query));
  displayBooks(filteredBooks);
}

function clearSearch() {
  document.getElementById('search').value = '';
  displayBooks(fetchedBooks);
}

function toggleCreateBookModal(isEdit = false, index = null) {
  const modal = document.getElementById('create-book-modal');
  modal.style.display = modal.style.display === 'block' ? 'none' : 'block';

  const form = document.getElementById('create-book-form');
  form.onsubmit = isEdit ? (event) => updateBook(event, index) : createBook;
}

function createBook(event) {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const pages = document.getElementById('pages').value;
  const price = document.getElementById('price').value;

  const newBook = new Book(title, author, parseInt(pages), parseFloat(price));
  fetchedBooks.push(newBook);
  displayBooks(fetchedBooks);
  toggleCreateBookModal();
  document.getElementById('create-book-form').reset();
}

function editBook(index) {
  const book = fetchedBooks[index];
  document.getElementById('title').value = book.title;
  document.getElementById('author').value = book.author;
  document.getElementById('pages').value = book.pages;
  document.getElementById('price').value = book.price;

  toggleCreateBookModal(true, index);
}

function updateBook(event, index) {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const pages = document.getElementById('pages').value;
  const price = document.getElementById('price').value;

  const updatedBook = new Book(title, author, parseInt(pages), parseFloat(price));
  fetchedBooks[index] = updatedBook;
  displayBooks(fetchedBooks);
  toggleCreateBookModal();
  document.getElementById('create-book-form').reset();
}

function deleteBook(index) {
  fetchedBooks.splice(index, 1);
  displayBooks(fetchedBooks);
}

function sortBooks(criteria) {
  switch (criteria) {
    case 'author':
      fetchedBooks.sort((a, b) => a.author.localeCompare(b.author));
      break;
    case 'price':
      fetchedBooks.sort((a, b) => a.price - b.price);
      break;
    case 'pages':
      fetchedBooks.sort((a, b) => a.pages - b.pages);
      break;
    default:
      return;
  }
  displayBooks(fetchedBooks);
}


// Attach functions to window object
window.editBook = editBook;
window.deleteBook = deleteBook;
window.toggleCreateBookModal = toggleCreateBookModal;
window.sortBooks = sortBooks;
window.searchBooks = searchBooks;

// Initial display
document.addEventListener('DOMContentLoaded', () => {
  displayBooks(fetchedBooks);
});