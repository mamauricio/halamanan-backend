const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let itemSchema = new Schema({
 itemKey: { type: String, required: true },
 itemName: { type: String, required: true },
 imageUrl: { type: String, required: true },
 width: { type: String, required: true },
 height: { type: String, required: true },
 x: { type: Number, required: true },
 y: { type: Number, required: true },
});

let designSchema = new Schema({
 user_id: {
  type: String,
  required: true,
 },
 designName: String,
 backgroundImage: { type: String },
 designThumbnail: { type: String },
 items: [itemSchema],
});

module.exports = mongoose.model('Design', designSchema);
