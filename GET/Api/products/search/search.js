app.get('/api/products/search', asyncWrapper(async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Search query is required' });

  const products = await Product.find({
    name: { $regex: q, $options: 'i' } // case-insensitive search
  });

  res.json(products);
}));
