import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import db from '../db.js';
import verifyToken from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';
import process from 'process';

const router = express.Router();

// Use CORS middleware
router.use(cors());


async function getBooks() {
  const query = `
    SELECT 
      b.id, b.title, b.author, b.description, b.pages, b.genre, b.price, b.image_url,
      bs.color, bs.quantity
    FROM books b
    LEFT JOIN book_stock bs ON b.id = bs.book_id
  `;
  const [rows] = await db.promise().query(query);
  
  const books = rows.reduce((acc, row) => {
    const book = acc.find(b => b.id === row.id);
    if (book) {
      book.stock[row.color] = row.quantity;
    } else {
      acc.push({
        id: row.id,
        title: row.title,
        author: row.author,
        description: row.description,
        pages: row.pages,
        genre: row.genre,
        price: row.price,
        image_url: row.image_url,
        stock: { [row.color]: row.quantity }
      });
    }
    return acc;
  }, []);
  
  return books;
}

// Route to get cart items
router.get('/api/cart', verifyToken, async (req, res) => {
  const userId = req.user.id; // Use the user ID from the JWT
  try {
    const [cartRows] = await db.promise().query(`
      SELECT cart.*, books.title, books.price, books.image_url 
      FROM cart 
      JOIN books ON cart.book_id = books.id 
      WHERE cart.user_id = ?
    `, [userId]);
    res.status(200).json(cartRows);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Route to save cart items
router.post('/api/saveCart', verifyToken, async (req, res) => {
  const userId = req.user.id; // Use the user ID from the JWT
  const { cartItems } = req.body;

  console.log('Received userId:', userId);
  console.log('Received cartItems:', cartItems);

  // Validate cartItems
  if (!cartItems || !Array.isArray(cartItems) || cartItems.some(item => !item.bookId || !item.color || !item.quantity)) {
    console.log('Invalid cart items:', cartItems);
    return res.status(400).json({ error: 'Invalid cart items' });
  }

  // Check if userId exists in the users table
  const [userRows] = await db.promise().query('SELECT id FROM users WHERE id = ?', [userId]);
  if (userRows.length === 0) {
    console.log('User not found:', userId);
    return res.status(404).json({ error: 'User not found' });
  }

  // Begin transaction
  const connection = await db.promise().getConnection();
  await connection.beginTransaction();

  try {
    // Clear existing cart items for the user
    await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);

    // Insert new cart items
    for (const item of cartItems) {
      await connection.query(
        'INSERT INTO cart (user_id, book_id, quantity, color) VALUES (?, ?, ?, ?)',
        [userId, item.bookId, item.quantity, item.color]
      );
    }

    // Commit transaction
    await connection.commit();
    res.status(200).json({ message: 'Cart saved successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error saving cart items:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    connection.release();
  }
});

// Route to register a new user
router.post('/api/register', async (req, res) => {
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

// Route to login a user
router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [userResults] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (userResults.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = userResults[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get user ID by email
router.post('/api/getUserId', async (req, res) => {
  const { email } = req.body;
  console.log('Received email:', email);
  const [rows] = await db.promise().query('SELECT id FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ userId: rows[0].id });
});

// Route to get books
router.get('/api/books', async (req, res) => {
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
        return a[filter] > b[filter] ? -1 : 1;
      });
    }

    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Route to get a book by ID
router.get('/api/books/:id', async (req, res) => {
  const bookId = req.params.id;
  const query = `
    SELECT 
      b.id, b.title, b.author, b.description, b.pages, b.genre, b.price, b.image_url,
      bs.color, bs.quantity
    FROM books b
    LEFT JOIN book_stock bs ON b.id = bs.book_id
    WHERE b.id = ?
  `;
  const [rows] = await db.promise().query(query, [bookId]);
  
  if (rows.length === 0) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const book = rows.reduce((acc, row) => {
    if (!acc) {
      acc = {
        id: row.id,
        title: row.title,
        author: row.author,
        description: row.description,
        pages: row.pages,
        genre: row.genre,
        price: row.price,
        image_url: row.image_url,
        stock: []
      };
    }
    acc.stock.push({ color: row.color, quantity: row.quantity });
    return acc;
  }, null);

  res.json(book);
});

export default router;