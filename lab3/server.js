const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Use CORS middleware
app.use(cors());

app.use(express.json());

const booksFilePath = path.join(__dirname, 'books', 'books.json');

// Helper function to read books from the JSON file
function readBooks() {
    const data = fs.readFileSync(booksFilePath, 'utf8');
    return JSON.parse(data);
}

// Helper function to write books to the JSON file
function writeBooks(books) {
    fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2), 'utf8');
}

app.get('/lab3/books/books.json', (req, res) => {
    const books = readBooks();
    res.json(books);
});

app.put('/lab3/books/:id', (req, res) => {
    const books = readBooks();
    const bookId = parseInt(req.params.id, 10);
    const updatedBook = req.body;

    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    books[bookIndex] = { ...books[bookIndex], ...updatedBook };
    writeBooks(books);

    res.json(books[bookIndex]);
});

app.delete('/lab3/books/:id', (req, res) => {
    const books = readBooks();
    const bookId = parseInt(req.params.id, 10);

    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const deletedBook = books.splice(bookIndex, 1);
    writeBooks(books);

    res.json(deletedBook[0]);
});

// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});