const express = require('express');
const router = express.Router();
const { setUserId } = require('../middleware/setUserId');
const isAdmin = require('../middleware/isAdmin');
const {
 login,
 signup,
 getUsers,
 logout,
 getUser,
 updateUser,
 promoteToAdmin,
 deleteUser,
 demoteUser,
 resetPassword,
 //  changePassword,
} = require('../controllers/userControllers');

//getUsers
router.get('/login', getUsers);

router.get('/profile', getUser);

//login
router.post('/login', login);

//signup
router.post('/signup', signup);

router.delete('/logout', logout);

router.get('/admin/users', getUsers);
router.delete('/admin/users/:id', deleteUser);
router.patch('/profile/:id/', updateUser);
router.patch('/admin/users/:id/promote', promoteToAdmin);
router.patch('/admin/users/:id/demote', demoteUser);
router.post('/reset-password/', resetPassword);
// router.post('/reset-password/:id', changePassword);

router.use(setUserId);

module.exports = router;
