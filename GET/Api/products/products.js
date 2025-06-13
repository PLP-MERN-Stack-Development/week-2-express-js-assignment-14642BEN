app.get('/api/products', asyncWrapper(async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  const query = category ? { category } : {};

  const products = await Product.find(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json(products);
}));
