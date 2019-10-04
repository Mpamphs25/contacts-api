const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    name:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:String
    }

})



module.exports = mongoose.model('contacts',contactSchema);