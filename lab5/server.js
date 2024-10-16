// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public'))); // Assuming your HTML, CSS, and JS files are in a 'public' folder

// Load books from JSON file
const getBooks = () => {
    const data = fs.readFileSync(path.join(__dirname, 'books.json'));
    return JSON.parse(data);
};

// Save books to JSON file
const saveBooks = (books) => {
    fs.writeFileSync(path.join(__dirname, 'books.json'), JSON.stringify(books, null, 2));
};

// GET: Read all books
app.get('/api/books', (req, res) => {
    res.json(getBooks());
});

// POST: Create a new book
app.post('/api/books', (req, res) => {
    const books = getBooks();
    const newBook = req.body;
    books.push(newBook);
    saveBooks(books);
    res.status(201).json(newBook);
});

// PUT: Update a book
app.put('/api/books/:title', (req, res) => {
    const books = getBooks();
    const { title } = req.params;
    const updatedBook = req.body;

    const index = books.findIndex(book => book.title === title);
    if (index === -1) {
        return res.status(404).send('Book not found');
    }

    books[index] = updatedBook;
    saveBooks(books);
    res.json(updatedBook);
});

// DELETE: Delete a book
app.delete('/api/books/:title', (req, res) => {
    const books = getBooks();
    const { title } = req.params;

    const index = books.findIndex(book => book.title === title);
    if (index === -1) {
        return res.status(404).send('Book not found');
    }

    books.splice(index, 1);
    saveBooks(books);
    res.status(204).send();
});

// Serve the HTML file at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Adjust the path as necessary
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
