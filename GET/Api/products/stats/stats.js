app.get('/api/products/stats', asyncWrapper(async (req, res) => {
  const stats = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        count: 1
      }
    }
  ]);

  res.json(stats);
}));
