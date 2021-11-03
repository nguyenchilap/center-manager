const mongoose = require('mongoose');
//const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const AccountSchema = new Schema(
    {
        // _id: {type: Number},
        username: {type: String, maxlength: 100, unique: true, required: true},
        password: {type: String, maxlength: 100, required: true},
        type: {type: Number, default: 3},
        createAt: {type: Date, default: Date.now},
    },
    {
        // _id: false,
        timestamp: true,
    }
);


//Add plugin
// AccountSchema.plugin(AutoIncrement);


module.exports = mongoose.model('Account', AccountSchema);