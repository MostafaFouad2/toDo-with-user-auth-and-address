const mongoose = require('mongoose');
const User = mongoose.model(
  "User",
  new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ToDo"
    }
  ],
  adress:
      {
        country:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Address',
          required: true
          },
        citey:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Address',
          required: true
          }
      },
  isAdmin:{
    type:Boolean,
    default:false,
  }
}
));

module.exports = User;

