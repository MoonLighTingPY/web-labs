import express, { json } from 'express';
import cors from 'cors';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();

app.use(cors());
app.use(json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getBooks = async () => {
  const filePath = path.join(__dirname, 'src/api/books.json');
  const data = await readFile(filePath, 'utf8');
  return JSON.parse(data);
};
app.get('/api/books', async (req, res) => {
    const { search, filter, order } = req.query;
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
  });
  

app.get('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  const books = await getBooks();
  const book = books.find(b => b.id === parseInt(id));
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(book);
});

import process from 'process';
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
