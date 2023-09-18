const Item = require('../models/itemModel');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

//add new item
const addItem = async (req, res) => {
 console.log(req.body);
 try {
  const {
   itemName,
   scientificName,
   itemInformation,
   category,
   type,
   informationSource,
   imageSource,
   imageUrl,
  } = req.body;

  const item = new Item({
   itemName,
   scientificName,
   itemInformation,
   category,
   type,
   informationSource,
   imageSource,
   imageUrl,
  });

  // console.log(item);

  const status = await item.save();
  res.status(201).json(status);
 } catch (error) {
  // console.log(error);
  res.status(400).json({ error });
 }
};

//get all items
const getItems = async (req, res) => {
 try {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const category = req.query.category || '';
  const type = req.query.type || '';
  const typeArray = type.split(',').map((type) => type.trim());
  const query = {};

  if (category === 'all' || category === null) {
   query.category = 'all';
   const totalCount = await Item.countDocuments();
   const totalPages = Math.ceil(totalCount / limit) + 1;

   const items = await Item.find()
    .sort({ category: -1, itemName: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

   res.json({ items, page, totalPages, totalCount });
  } else {
   query.category = category;

   if (type) {
    query.type = typeArray.map((type) => type.trim());
    console.log();
    if (type && type.length > 0) {
     query.type = { $in: typeArray };
    }
   }
   const totalCount = await Item.countDocuments(query);
   const totalPages = Math.ceil(totalCount / limit) + 1;

   const items = await Item.find(query)
    .sort({ category: -1, itemName: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

   res.json({ items, page, totalPages, totalCount });
  }
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};

//get single item
const getItem = async (req, res) => {
 try {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
   return res.status(404).json({ error: 'Invalid item ID' });
  }

  const item = await Item.findById(id);
  if (!item) {
   return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};

//edit
const editItem = async (req, res) => {
 const { id } = req.params;

 if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(404).json({ error: 'Invalid item ID' });
 }

 const item = await Item.findByIdAndUpdate(
  { _id: id },
  {
   ...req.body,
  }
 );

 if (!item) {
  return res.status(400).json({ error: 'Item not found' });
 }

 //  console.log(item);

 res.status(200).json(item);
};

//delete item
const deleteItem = async (req, res) => {
 const { id } = req.params;

 Item.findByIdAndDelete(id)
  .then(() => {
   res.status(204).send();
  })
  .catch((error) => {
   console.error('Error deleting item:', error);
   res.status(500).json({ error: 'Failed to delete item' });
  });
};

module.exports = {
 addItem,
 editItem,
 getItems,
 getItem,
 deleteItem,
};
