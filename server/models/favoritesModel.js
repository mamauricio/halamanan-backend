const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoritesSchema = new Schema({
  userId: { type: String, ref: 'User', required: true },
  itemId: { type: String, ref: 'Item', required: true },
});

module.exports = mongoose.model('Favorite', favoritesSchema);
