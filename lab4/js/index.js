const BASE_URL = 'http://localhost:3000/api/books';

async function fetchBooks() {
    const response = await axios.get(BASE_URL);
    displayBooks(response.data);
}

async function createBook(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const price = document.getElementById('price').value;

    const newBook = { title, author, pages: parseInt(pages), price: parseFloat(price) };

    try {
        await axios.post(BASE_URL, newBook);
        fetchBooks(); // Refresh the book list
        toggleCreateBookModal();
        document.getElementById('create-book-form').reset();
    } catch (error) {
        console.error('Error creating book:', error);
    }
}

async function updateBook(event, title) {
    event.preventDefault();
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const price = document.getElementById('price').value;

    const updatedBook = { title, author, pages: parseInt(pages), price: parseFloat(price) };

    try {
        await axios.put(`${BASE_URL}/${title}`, updatedBook);
        fetchBooks(); // Refresh the book list
        toggleCreateBookModal();
        document.getElementById('create-book-form').reset();
    } catch (error) {
        console.error('Error updating book:', error);
    }
}

async function deleteBook(title) {
    try {
        await axios.delete(`${BASE_URL}/${title}`);
        fetchBooks(); // Refresh the book list
    } catch (error) {
        console.error('Error deleting book:', error);
    }
}

async function searchBooks() {
    const query = document.getElementById('search').value.trim().toLowerCase();
    const response = await axios.get(BASE_URL);
    const filteredBooks = response.data.filter(book => book.title.toLowerCase().includes(query));
    displayBooks(filteredBooks);
}

// Call this to load books initially
fetchBooks();
