import jwt from 'jsonwebtoken';
import process from 'process';
import bcrypt from 'bcrypt';
import db from '../db.js';

export async function loginUser(req, res) {
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
    console.log('Generated Token:', token);
    return res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}