async function getHomepage(req, res) {
  res.render('index', { title: 'Homepage' });
}

module.exports = { getHomepage };
