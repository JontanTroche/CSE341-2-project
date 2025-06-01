const router = require("express").Router();
const passport = require('passport');

router.use('/albums', require('./albums'));
router.use('/members', require('./members'));

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.send('Logged out');
  }
  return res.send(`Logged in as ${req.user.displayName || req.user.username}`);
});

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;