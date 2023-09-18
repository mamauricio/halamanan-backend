require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express'); // server software
const morgan = require('morgan'); //logger
const bodyParser = require('body-parser'); // parser middleware
const cors = require('cors');

const session = require('express-session'); // session middleware
const passport = require('passport'); // authentication
const User = require('./server/models/userModel.js'); // User Model

const app = express();
app.use((req, res, next) => {
 res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
 res.header(
  'Access-Control-Allow-Headers',
  'token,Content-Type,Authorization,newItemUserId'
 );
 res.header('Access-Control-Allow-Credentials', 'true');
 if (req.method === 'OPTIONS') {
  res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, GET, DELETE');
  return res.status(200).json({});
 }
 next();
});

app.use(morgan('tiny'));

const port = process.env.PORT;
// const uri = process.env.ATLAS_URI;
const uri = 'mongodb://localhost:27017/halamanan';

// Connect to MongoDB
mongoose
 .connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
 })
 .then(() => {
  app.listen(port || 3001, () => {
   console.log('connected');
  });
 })
 .catch((error) => {});

app.use(
 session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }, // 1 hour
 })
);

// Configure Middleware
app.use(
 bodyParser.urlencoded({
  limit: '200mb',
  extended: true,
 })
);
app.use(bodyParser.json({ limit: '200mb' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

// To use with sessions

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Passport

const userRoutes = require('./server/routes/user');
const itemRoutes = require('./server/routes/item');
const designRoutes = require('./server/routes/design');
const favoritesRoutes = require('./server/routes/favorites');
const newItemRoutes = require('./server/routes/newItem');

app.use(express.static('public'));
app.use('/new_items', express.static('new_items'));
app.use('/item_images', express.static('item_images'));
app.use('', designRoutes);
app.use('', userRoutes);
app.use('', itemRoutes);
app.use('', favoritesRoutes);
app.use('', newItemRoutes);

module.exports = { app };
