const express = require('express');
const router = express.Router();
const NewItem = require('../models/newItemModel');
const {
 getNewItems,
 addNewItem,
 deleteNewItem,
 adminGetNewItems,
} = require('../controllers/newItemController');

const multer = require('multer');
const storage = multer.diskStorage({
 destination: function (req, file, cb) {
  cb(null, 'public/new_items'); // Specify the destination folder
 },
 filename: function (req, file, cb) {
  const newItemName = req.body.newItemName; // Get the newItemName from the request body
  const fileName = `${newItemName.replace(/\s/g, '')}.${file.originalname
   .split('.')
   .pop()}`; // Generate the filename based on newItemName and retain the original file extension
  cb(null, fileName);
 },
});

const upload = multer({ storage });

//get all
router.get('/profile/pending', getNewItems);

//create item
router.post('/gallery/newItem', upload.single('image'), addNewItem);

//delete item
router.delete('/profile/pending', deleteNewItem);

router.delete('/admin/pending', deleteNewItem);

router.get('/admin/pending', adminGetNewItems);

module.exports = router;
