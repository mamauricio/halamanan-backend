const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  itemName: { type: String, required: true },
  scientificName: String,
  itemInformation: String,
  category: String,
  type: [String],
  informationSource: String,
  imageSource: String,
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model('Item', itemSchema);
