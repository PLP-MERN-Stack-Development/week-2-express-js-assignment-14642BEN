const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const logger = require('./middleware/logger');
const authenticate = require('./middleware/auth');
const validateProduct = require('./middleware/validateProduct');
const errorHandler = require('./middleware/errorHandler');
const asyncWrapper = require('./utils/asyncWrapper');
const { NotFoundError } = require('./utils/errors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(logger);
app.use(authenticate);

mongoose.connect('mongodb://localhost:27017/products_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes

app.get('/api/products', asyncWrapper(async (req, res) => {
  const products = await Product.find();
  res.json(products);
}));

app.get('/api/products/:id', asyncWrapper(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new NotFoundError();
  res.json(product);
}));

app.post('/api/products', validateProduct, asyncWrapper(async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
}));

app.put('/api/products/:id', validateProduct, asyncWrapper(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) throw new NotFoundError();
  res.json(product);
}));

app.delete('/api/products/:id', asyncWrapper(async (req, res) => {
  const result = await Product.findByIdAndDelete(req.params.id);
  if (!result) throw new NotFoundError();
  res.status(204).send();
}));

// Catch-all 404 handler
app.use((req, res, next) => {
  next(new NotFoundError('Route not found'));
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
