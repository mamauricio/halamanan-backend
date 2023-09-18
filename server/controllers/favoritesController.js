const Favorites = require('../models/favoritesModel');
const Items = require('../models/itemModel');

const getFavoritesID = async (req, res) => {
 try {
  const userId = req.headers.token;
  const favorites = await Favorites.find({ userId });
  const favoriteItemIds = favorites.map((favorite) => favorite.itemId);
  return res.status(200).json(favoriteItemIds);
 } catch (error) {
  res.status(500).json({ error: 'Error fetching user favorites' });
 }
};

const getFavorites = async (req, res) => {
 const userId = req.query.token;

 try {
  const favorites = await Favorites.find({ userId });
  const favoriteItemIds = favorites.map((favorite) => favorite.itemId);
  try {
   const galleryItems = await Items.find({
    _id: { $in: favoriteItemIds },
   }).sort({ category: -1, itemName: 1 });
   res.json(galleryItems);
  } catch (error) {}
 } catch (error) {
  res.status(500).json({ error: 'Error fetching user favorites' });
 }
};

const addToFavorites = async (req, res) => {
 try {
  const { itemId } = req.body;

  const userId = req.headers.token;
  const favorite = new Favorites({
   userId,
   itemId,
  });
  await favorite.save();
  res.json(favorite);
 } catch (error) {
  res.status(500).json({ error: 'Error adding item to favorites' });
 }
};

const removeFromFavorites = async (req, res) => {
 try {
  const { itemId } = req.body;
  const userId = req.headers.token;

  const deletedItem = await Favorites.findOneAndDelete({ userId, itemId });
  res.status(201).json('Successfully removed item from favorites');
 } catch (error) {
  res.status(500).json({ error: 'Error removing item to favorites' });
 }
};

module.exports = {
 getFavorites,
 getFavoritesID,
 addToFavorites,
 removeFromFavorites,
};
