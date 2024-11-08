import express, { json } from 'express';
import cors from 'cors';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

import bcrypt from 'bcrypt';
import mysql from 'mysql2';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'webdb',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getBooks = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM books';
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getUsers = async () => {
  const filePath = path.join(__dirname, 'src/api/users.json');
  const data = await readFile(filePath, 'utf8');
  return JSON.parse(data);
};


app.post('/api/register', async (req, res) => {
  const { email, password, name, username } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (email, password, name, username) VALUES (?, ?, ?, ?)';
  db.query(query, [email, hashedPassword, name, username], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'User already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: result.insertId, email, name, username });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(400).json({ error: 'Invalid email or password' });

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: 'Invalid email or password' });

    res.json({ email: user.email, name: user.name, username: user.username });
  });
});

app.post('/api/checkUserExists', async (req, res) => {
  const { email, username } = req.body;
  const users = await getUsers();
  const userExists = users.some(user => user.email === email || user.username === username);
  res.json({ exists: userExists });
});



app.get('/api/books', async (req, res) => {
  const { search, filter, order } = req.query;
  try {
    let books = await getBooks();

    if (search) {
      books = books.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter) {
      books = books.sort((a, b) => {
        if (order === 'desc') {
          return a[filter] < b[filter] ? 1 : -1;
        }
        return a[filter] > b[filter] ? 1 : -1;
      });
    }

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM books WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'Book not found' });
    res.json(results[0]);
  });
});

app.post('/api/update-stock', async (req, res) => {
  const { cart } = req.body;
  let books = await getBooks();

  cart.forEach(cartItem => {
    const book = books.find(book => book.id === cartItem.id);
    if (book) {
      book.stock[cartItem.color] -= cartItem.quantity;
    }
  });

  const filePath = path.join(__dirname, 'src/api/books.json');
  await writeFile(filePath, JSON.stringify(books, null, 2), 'utf8');

  res.status(200).send({ message: 'Stock updated successfully' });
});

app.post('/api/saveCart', async (req, res) => {
  const { userId, cartItems } = req.body;

  console.log('Received userId:', userId);
  console.log('Received cartItems:', cartItems);

  // Validate cartItems
  if (!cartItems || !Array.isArray(cartItems) || cartItems.some(item => !item.bookId)) {
    return res.status(400).json({ error: 'Invalid cart items' });
  }

  // Check if userId exists in the users table
  const [userRows] = await db.promise().query('SELECT id FROM users WHERE id = ?', [userId]);
  if (userRows.length === 0) {
    return res.status(400).json({ error: 'User ID does not exist' });
  }

  // Check if all bookIds exist in the books table
  const bookIds = cartItems.map(item => item.bookId);

if (bookIds.length === 0) {
  return res.status(400).json({ error: 'No book IDs provided' });
}

const [bookRows] = await db.promise().query('SELECT id FROM books WHERE id IN (?)', [bookIds]);
const existingBookIds = bookRows.map(row => row.id);

if (bookIds.some(bookId => !existingBookIds.includes(bookId))) {
  return res.status(400).json({ error: 'One or more book IDs do not exist' });
}

  const deleteQuery = 'DELETE FROM cart WHERE user_id = ?';
  db.query(deleteQuery, [userId], (err) => {
    if (err) {
      console.error('Error deleting cart items:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const insertQuery = 'INSERT INTO cart (user_id, book_id, quantity) VALUES ?';
    const values = cartItems.map(item => [userId, item.bookId, item.quantity]);
    db.query(insertQuery, [values], (err) => {
      if (err) {
        console.error('Error inserting cart items:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json(cartItems);
    });
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});