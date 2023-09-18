const setUserId = (req, res, next) => {
 if (req.user) {
  //console.log((req.user);
  // req.userId = req.user.id;
 }
 next();
};

module.exports = { setUserId };
