const User = require('../models/userModel');
const passport = require('passport');
const nodemailer = require('nodemailer');
passport.use(User.createStrategy());

const login = (req, res, next) => {
 passport.authenticate('local', (err, user) => {
  if (err) {
   return res.status(500).json({ error: err.message });
  }
  if (!user) {
   return res.status(401).json({ error: 'Invalid email or password.' });
  }

  req.login(user, (err) => {
   if (err) {
    return res.status(401).json({ error: 'Invalid password.' });
   }

   if (user.role === 'admin') {
    return res.status(200).json('admin');
   }
   res.status(200).json({ userId: req.user.id });
  });
 })(req, res, next);
};

const signup = async (req, res) => {
 try {
  const { firstName, lastName, email, password } = req.body;

  const user = await User.register(
   { firstName: firstName, lastName: lastName, email: email },
   password
  );

  req.login(user, (error) => {
   if (error) {
    throw error;
   }
   res.status(200).json({ message: 'Signed up and logged in successfully' });
  });
 } catch (error) {
  if (error.name === 'UserExistsError') {
   res.status(409).json({ error: 'User already registered' });
  } else {
   res.status(500).json({ error: 'Internal server error' });
  }
 }
};

const getUsers = async (req, res) => {
 try {
  if (req.headers.token !== 'admin') {
   res.status(404).json('Forbidden');
  }

  const user = await User.find();
  if (!user) {
   res.status(204).json('No users yet');
  }
  res.status(200).json(user);
 } catch (error) {
  res.status(500).json({ error: 'Internal Server Error' });
 }
};

const updateUser = async (req, res) => {
 try {
  console.log('hello');
  const { id } = req.params;
  const updatedData = req.body;
  console.log(updatedData);
  console.log(id);
  const existing = await User.findOne({ email: updatedData.email });

  if (existing && existing._id.toString() !== id) {
   res.status(400).json({
    error: 'Email already exists. Please use a different email address',
   });
  } else {
   const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    {
     firstName: updatedData.firstName,
     lastName: updatedData.lastName,
     email: updatedData.email,
    }
   );

   const details = {
    firstName: updatedData.firstName,
    lastName: updatedData.lastName,
    email: updatedData.email,
   };
   if (!updatedUser) {
    return res.status(400).json({ message: 'Error updating user data' });
   }
   res.status(200).json(details);
  }
 } catch (error) {
  //   res.status(500).json({ error: 'Internal Server Error' });
 }
};

const promoteToAdmin = async (req, res) => {
 const { id } = req.params;
 try {
  const role = 'admin';
  const promotedUser = await User.findOneAndUpdate({ _id: id }, { role });
  if (!promotedUser) {
   return res.status(400).json({ message: `Error updating user's role` });
  }
  res.json(promotedUser);
 } catch (error) {
  res.status(500).json({ error: 'Internal.' });
 }
};

const demoteUser = async (req, res) => {
 const { id } = req.params;
 try {
  const role = 'user';
  const promotedUser = await User.findOneAndUpdate({ _id: id }, { role });
  if (!promotedUser) {
   return res.status(400).json({ message: `Error updating user's role` });
  }
  res.json(promotedUser);
 } catch (error) {
  res.status(500).json({ error: 'Internal.' });
 }
};

const deleteUser = async (req, res) => {
 try {
  const { id } = req.params;
  const user = await User.findById({ _id: id });
  if (!user) {
   return res.status(404).json({ message: 'User not found' });
  }

  await User.findByIdAndDelete(id);

  res.status(200).json({ message: 'User deleted successfully' });
 } catch (error) {
  res.status(500).json({ message: 'Internal server error' });
 }
};

const getUser = async (req, res) => {
 const userId = req.headers.token;
 try {
  const user = await User.findById({ _id: userId });
  if (!user) {
   return res.status(204).json('User not found.');
  }

  const details = {
   firstName: user.firstName,
   lastName: user.lastName,
   email: user.email,
  };

  res.status(200).json(details);
 } catch (error) {
  res.status(500).json({ error: 'Internal Server Error' });
 }
};

const logout = async (req, res) => {
 if (req.session) {
  req.session.destroy((err) => {
   if (err) {
    res.status(400).send('Unable to log out');
   } else {
    res.send('Logout successful');
   }
  });
 } else {
  res.end();
 }
};

const resetPassword = async (req, res) => {
 const email = req.params;
 const user = User.find({ email });
 // if()
 const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
   user: 'halamanan.4030@gmail.com',
   pass: 'Halamanan_4030',
  },
 });

 const message = {
  from: 'halamanan.4030@gmail.com',
  to: email,
  subject: 'Password Reset',
  text:
   'You have requested a password reset. Click the link to reset your password.',
  html: `<a href="http://localhost:3000/reset-password/${user._id}>`,
 };

 //  console.log(mailOptions);
 try {
  transporter.sendMail(message, (error, info) => {
   if (error) {
    console.log(error);
    res.status(500).send('Error sending email.');
   } else {
    console.log('Email sent: ' + info.response);
    res.status(200).send('Email sent successfully');
   }
  });
 } catch (error) {
  res.status();
 }
};

module.exports = {
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
};
