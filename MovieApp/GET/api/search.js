router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  try {
    const results = await Movie.find({ title: { $regex: q, $options: 'i' } });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;