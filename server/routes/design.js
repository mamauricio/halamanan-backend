const express = require('express');
const router = express.Router();
// const {checkAuth} = require('../../server')
const {
 getAllDesigns,
 getDesign,
 createDesign,
 deleteDesign,
 // saveEdit,
 saveDesign,
 updateDescription,
} = require('../controllers/designControllers');

//get all
router.get('/designs', getAllDesigns);

//create
router.post('/designs/create', createDesign);

//display design
router.get('/designs/:id', getDesign);

//delete
router.delete('/designs/:id', deleteDesign);

//update
router.patch('/designs/:id', saveDesign);

router.patch('/designs/', updateDescription);

module.exports = router;
