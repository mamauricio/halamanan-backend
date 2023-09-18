const express = require('express');
const router = express.Router();
const {
 getFavorites,
 getFavoritesID,
 addToFavorites,
 removeFromFavorites,
} = require('../controllers/favoritesController');

// const router = express.Router()

router.get('/favorites', getFavorites);
router.get('/favorites-id', getFavoritesID);

router.post('/favorites', addToFavorites);
router.delete('/favorites', removeFromFavorites);

module.exports = router;
