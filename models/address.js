const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  nameEn:{
    type:String,
    required:true,
    unique:true
  },
  nameAr:{
    type:String,
    required:true,
    unique:true
  },
  imageUrl: {
    type: String,
    required: true
  },
  isCitey:{
    type:Boolean,
    required:true
  },
  country_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: function() { return this.citey == true}
  }
})




const Address = mongoose.model('Address', schema);




module.exports = Address;