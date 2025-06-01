const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'You do not have access.' });
  }
  next();
};

module.exports = {
  isAuthenticated
};