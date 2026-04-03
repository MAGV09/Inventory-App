async function getHomepage(req, res) {
  res.redirect('/products');
}

module.exports = { getHomepage };
