const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./usermodel');
const { Book } = require('./bookmodel');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/BookBuddy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// JWT Middleware
const auth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Access denied. No token provided.');
  try {
    const decoded = jwt.verify(token, 'secretKey');
    req.user = decoded;
    next();
  } catch {
    res.status(400).send('Invalid token.');
  }
};

// Register
app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).send('Invalid email or password');

  const token = jwt.sign({ id: user._id }, 'secretKey');
  res.cookie('token', token, { httpOnly: true });
  res.send({ message: 'Login successful' });
});

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.send({ message: 'Logged out successfully' });
});

// Create Book
app.post('/books', auth, async (req, res) => {
  const book = new Book({ ...req.body, user: req.user.id });
  await book.save();
  res.status(201).send(book);
});

// View Books
app.get('/books', auth, async (req, res) => {
  const books = await Book.find({ user: req.user.id });
  res.send(books);
});

// Update Book
app.put('/books/:id', auth, async (req, res) => {
  const book = await Book.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  if (!book) return res.status(404).send('Book not found');
  res.send(book);
});

// Delete Book
app.delete('/books/:id', auth, async (req, res) => {
  const book = await Book.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!book) return res.status(404).send('Book not found');
  res.send({ message: 'Book deleted successfully' });
});





app.listen(8080, () => {
  console.log("Listening on port 8080");
});