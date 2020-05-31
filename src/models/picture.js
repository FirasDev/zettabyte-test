const mongoose = require('mongoose')

const pictureSchema = new mongoose.Schema({
    pictureDate:{
        type : Date,
        default : Date.now,
        require : true
    },
    image: 
      { 
        type : String,
        required:true 
    },
    caption:
    { 
        type : String,
        required:true 
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required :true,
        ref: 'User'
    }
})

const Picture = mongoose.model('Picture',pictureSchema)

module.exports = Picture