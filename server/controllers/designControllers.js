const Design = require('../models/designModel');
const mongoose = require('mongoose');

//get all designs
const getAllDesigns = async (req, res) => {
 try {
  const token = req.headers.token;
  if (token === 'admin') {
   const designs = await Design.find().sort({
    createdAt: -1,
   });
   if (designs.length === 0) {
    return res.status(204).json({ error: 'No designs found' });
   }

   return res.status(200).json(designs);
  }

  const designs = await Design.find({ user_id: token }).sort({
   createdAt: -1,
  });
  if (designs.length === 0) {
   return res.status(204).json({ error: 'No designs found' });
  }

  res.status(200).json(designs);
 } catch (error) {
  console.error('Error fetching designs:', error);
  res.status(500).json({ error: 'Internal server error' });
 }
};

//get single design
const getDesign = async (req, res) => {
 try {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
   return res.status(404).json({ error: 'Invalid design id' });
  }

  const design = await Design.findById(id);
  if (!design) {
   return res.status(404).json({ error: 'Design not found' });
  }
  res.json(design);
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};

//create
const createDesign = async (req, res) => {
 try {
  const { designThumbnail, items, designName, backgroundImage, user_id } =
   req.body;

  const newDesign = new Design(req.body);

  await newDesign.save();
  res.status(201).json(newDesign._id);
 } catch (error) {
  res.status(500).json({ error: 'Failed creating design' });
 }
};

//delete
const deleteDesign = async (req, res) => {
 try {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
   return res.status(404).json({ error: 'No such design' });
  }

  await Design.findByIdAndDelete(id);
  res.status(204).json('Successfully delete design.');
 } catch (error) {
  res.status(500).json({ error: 'Internal Server Error' });
 }
};

// update description
const updateDescription = async (req, res) => {
 try {
  const { id } = req.params;
  const { designDescription } = req.body;

  const updatedDesign = await Design.findOneAndUpdate(
   { _id: id },
   {
    designDescription,
   },
   { new: true }
  );

  if (!updatedDesign) {
   return res.status(400).json({ message: 'Error saving the design' });
  }
 } catch (error) {
  res.status(500).json({ error: 'Internal Server Error' });
 }
};

//save
const saveDesign = async (req, res) => {
 try {
  const { id } = req.params;
  const { designName, backgroundImage, items, designThumbnail } = req.body;
  const updatedDesign = await Design.findOneAndUpdate(
   { _id: id },
   {
    designName,
    designThumbnail,
    backgroundImage,
    items,
   },
   { new: true }
  );

  if (!updatedDesign) {
   return res.status(400).json({ message: 'Error saving the design' });
  }
  res.json(updatedDesign);
 } catch (error) {
  res.status(500).json({ error: 'Internal Server Error' });
 }
};

module.exports = {
 getAllDesigns,
 getDesign,
 createDesign,
 deleteDesign,
 updateDescription,
 saveDesign,
};
