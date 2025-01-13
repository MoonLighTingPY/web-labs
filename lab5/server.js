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
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Helper function to load books from JSON file
const getBooks = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'books.json'));
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading books file:', error);
        return [];
    }
};

// Helper function to save books to JSON file
const saveBooks = (books) => {
    try {
        fs.writeFileSync(path.join(__dirname, 'books.json'), JSON.stringify(books, null, 2));
    } catch (error) {
        console.error('Error saving books file:', error);
    }
};

// GET: Read all books with optional search and sort
app.get('/api/books', (req, res) => {
    const { sortBy, search } = req.query;
    let books = getBooks();

    // Filter books based on the search query
    if (search) {
        books = books.filter(book => book.title.toLowerCase().includes(search.toLowerCase()));
    }

    // Sort books based on the provided criteria
    if (sortBy) {
        books.sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'author':
                    return a.author.localeCompare(b.author);
                case 'price':
                    return a.price - b.price;
                case 'pages':
                    return a.pages - b.pages;
                default:
                    return 0;
            }
        });
    }

    res.json(books);
});

// POST: Create a new book
app.post('/api/books', (req, res) => {
    const books = getBooks();
    const newBook = req.body;

    // Check for duplicate titles
    if (books.some(book => book.title === newBook.title)) {
        return res.status(400).send('A book with this title already exists.');
    }

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

    // Check for duplicate titles
    if (books.some(book => book.title === updatedBook.title && book.title !== title)) {
        return res.status(400).send('A book with this title already exists.');
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
    res.status(204).send(); // No content to send back
});

// Serve the HTML file at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
