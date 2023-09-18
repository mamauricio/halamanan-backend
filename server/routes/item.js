const express = require('express');
const router = express.Router();
const Item = require('../models/itemModel');
const {
 addItem,
 getItems,
 getItem,
 deleteItem,
 editItem,
} = require('../controllers/itemController');

//get all
router.get('/gallery/', getItems);

//get one
router.get('/gallery/:id', getItem);

//create item
router.post('/gallery/add-item', addItem);

//update item
router.patch('/gallery/edit/:id', editItem);

//delete item
router.delete('/gallery/:id', deleteItem);

module.exports = router;
