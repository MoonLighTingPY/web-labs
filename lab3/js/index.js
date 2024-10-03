let books = [];

const bookList = document.getElementById("book-list");
const createBookModal = document.getElementById("create-book-modal");
const createBookForm = document.getElementById("create-book-form");
const editBookModal = document.getElementById("edit-book-modal");
const editBookForm = document.getElementById("edit-book-form");

const renderBooks = () => {
  bookList.innerHTML = "";
  books.forEach((book, index) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.innerHTML = `
      <h3>${book.title}</h3>
      <p>Author: ${book.author}</p>
      <p>Pages: ${book.pages}</p>
      <p class="price">Price: ${book.price} UAH</p>
      <button onclick="editBook(${index})">Edit</button>
      <button onclick="deleteBook(${index})">Delete</button>
    `;
    bookList.appendChild(bookCard);
  });
};

const toggleCreateBookModal = () => {
  createBookModal.classList.toggle("show-modal");
};

const toggleEditBookModal = () => {
  editBookModal.classList.toggle("show-modal");
};

const createBook = (event) => {
  event.preventDefault();
  const formData = new FormData(createBookForm);
  const newBook = {
    title: formData.get("title"),
    author: formData.get("author"),
    pages: formData.get("pages"),
    price: formData.get("price"),
  };
  books.push(newBook);
  renderBooks();
  toggleCreateBookModal();
  createBookForm.reset();
};

const editBook = (index) => {
  const book = books[index];
  editBookForm.elements["title"].value = book.title;
  editBookForm.elements["author"].value = book.author;
  editBookForm.elements["pages"].value = book.pages;
  editBookForm.elements["price"].value = book.price;
  editBookForm.onsubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(editBookForm);
    books[index] = {
      title: formData.get("title"),
      author: formData.get("author"),
      pages: formData.get("pages"),
      price: formData.get("price"),
    };
    renderBooks();
    toggleEditBookModal();
  };
  toggleEditBookModal();
};

const deleteBook = (index) => {
  books.splice(index, 1);
  renderBooks();
};

createBookForm.addEventListener("submit", createBook);
document.querySelector(".close").addEventListener("click", toggleCreateBookModal);
document.querySelector(".close-edit").addEventListener("click", toggleEditBookModal);

renderBooks();