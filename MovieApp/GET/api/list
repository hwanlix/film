router.get('/list', async (req, res) => {
  const { genre, year } = req.query;
  let query = {};
  if (genre) query.genre = genre;
  if (year) query.year = year;

  try {
    const filtered = await Movie.find(query);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
