const express = require('express');
const mongoose = require('mongoose');
const mongodb = require('./data/database');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();

require('dotenv').config();

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Middleware para capturar errores de parsing JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON:', err.message);
    return res.status(400).json({ message: 'Invalid JSON format in request body.' });
  }
  next();
});

// Importar el middleware de autenticación
const { isAuthenticated } = require('./middleware/authenticate');

app.use('/', require('./routes'));
app.use('/members', require('./routes/members'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
}, 
function(accessToken, refreshToken, profile, done) {
  console.log('GitHub Profile:', profile); // Para depuración
  return done(null, profile); 
}
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('Deserialize User:', user); // Para depuración
  done(null, user);
});

app.get('/', (req, res) => { 
  res.send(req.isAuthenticated() ? `Logged in as ${req.user.displayName}` : "Logged Out");
});

app.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    res.redirect('/');
  });

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Conexión a MongoDB
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and node Running on port ${port}`);
    });
  }
});

app.use('/albums', isAuthenticated, require('./routes'));
app.use('/members', isAuthenticated, require('./routes/members'));