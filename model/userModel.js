const mongoose= require('mongoose');

const UserSchema = new mongoose.Schema({
  username:{
    type: String
  },
  email:{
    type: String,
  },
  password:{
    type: String,
  },
  isAvatarImageSet:{
    type: Boolean,
  },
  avatarImage:{
    type: String,
    default: ""
  }
})

module.exports = mongoose.model('Users', UserSchema);