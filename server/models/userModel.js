const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
let userSchema = new Schema({
 firstName: String,
 lastName: String,
 email: { type: String, unique: true },
 role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);
