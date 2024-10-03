const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5500;

app.use(cors());
app.use(express.json());

const booksFilePath = path.join(__dirname, 'lab3', 'books', 'books.json');

function readBooks() {
    const data = fs.readFileSync(booksFilePath, 'utf8');
    return JSON.parse(data);
}

function writeBooks(books) {
    fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
}

app.get('/lab3/books', (req, res) => {
    const books = readBooks();
    res.json(books);
});

app.post('/lab3/books', (req, res) => {
    const books = readBooks();
    const newBook = req.body;
    newBook.id = books.length ? books[books.length - 1].id + 1 : 1;
    books.push(newBook);
    writeBooks(books);
    res.status(201).json(newBook);
});

app.put('/lab3/books/:id', (req, res) => {
    const books = readBooks();
    const bookId = parseInt(req.params.id);
    const updatedBook = req.body;
    const bookIndex = books.findIndex(book => book.id === bookId);

    if (bookIndex !== -1) {
        books[bookIndex] = { ...books[bookIndex], ...updatedBook };
        writeBooks(books);
        res.json(books[bookIndex]);
    } else {
        res.status(404).send('Book not found');
    }
});

app.delete('/lab3/books/:id', (req, res) => {
    const books = readBooks();
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(book => book.id === bookId);

    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        writeBooks(books);
        res.status(204).send();
    } else {
        res.status(404).send('Book not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});