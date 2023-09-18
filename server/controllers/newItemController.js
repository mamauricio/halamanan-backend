const NewItem = require('../models/newItemModel');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const addNewItem = async (req, res) => {
 console.log('req.body');
 console.log(req.body);
 try {
  const {
   newItemUserId,
   newItemName,
   newItemScientificName,
   newItemDescription,
   newItemCategory,
   newItemType,
   newItemUrl,
  } = req.body;

  const imageName = newItemName.replace(/ /g, '') + '.png'; // Adjust the filename as needed
  // const destinationPath = path.join(
  //  __dirname,
  //  'public',
  //  'new_items',
  //  imageName
  // );
  // fs.renameSync(req.file.path, destinationPath);

  const item = new NewItem({
   newItemUserId,
   newItemName,
   newItemScientificName,
   newItemDescription,
   newItemCategory,
   //  imageUrl: newItemUrl,
   newItemType,
   newItemUrl,

   //  imageUrl: `/new_items/${imageName}`,
  });
  console.log('hello world');
  console.log(item);

  await item.save();
  res.status(201).json(item);
 } catch (error) {
  console.log(error);
  res.status(400).json({ error: error.message });
 }
};

const adminGetNewItems = async (req, res) => {
 try {
  const newItems = await NewItem.find();
  if (newItems === null) {
   return res.json({ error: 'No items yet.' });
  }
  res.json(newItems);
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};

//get all items
const getNewItems = async (req, res) => {
 const newItemUserId = req.headers.newitemuserid;
 try {
  const newItems = await NewItem.find({ newItemUserId: newItemUserId });
  res.json(newItems);
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};

//get single item
const getNewItem = async (req, res) => {
 try {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
   return res.status(404).json({ error: 'Invalid item ID' });
  }

  const newItem = await NewItem.findById(id);
  if (!item) {
   return res.status(404).json({ error: 'Item not found' });
  }
  res.json(newItem);
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};

//edit
const editNewItem = async (req, res) => {
 const { id } = req.params;

 if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(404).json({ error: 'Invalid item ID' });
 }

 const newItem = await NewItem.findByIdAndUpdate(
  { _id: id },
  {
   ...req.body,
  }
 );

 if (!newItem) {
  return res.status(400).json({ error: 'Item not found' });
 }

 res.status(200).json(item);
};

//delete item
const deleteNewItem = async (req, res) => {
 const itemId = req.query.id;

 NewItem.findByIdAndDelete(itemId)
  .then(() => {
   res.status(200).send();
  })
  .catch((error) => {
   console.error('Error deleting item:', error);
   res.status(500).json({ error: 'Failed to delete item' });
  });
};

module.exports = {
 addNewItem,
 editNewItem,
 getNewItems,
 getNewItem,
 deleteNewItem,
 adminGetNewItems,
};
