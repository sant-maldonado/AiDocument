import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, comparePassword, sanitizeUser } from '../models/User.js';

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    const user = await createUser({ username, email, password });
    if (!user) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const token = signToken(user._id);
    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(user, password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken(user._id);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
