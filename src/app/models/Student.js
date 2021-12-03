const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const StudentSchema = new Schema(
    {
        // _id: {type: Number},
        name: {type: String, maxlength: 50},
        birth: {type: String},
        phone: {type: String, maxlength: 20},
        email: {type: String, maxlength: 50},
        img: {type: String, default: '/img/users/default-avatar.jpg'},
        createAt: {type: Date, default: Date.now},
        account: {
            username: {type: String, required: true, unique: true},
            password: {type: String, required: true},
            createAt: {type: Date, default: Date.now()}
        },
    },
    {
        // _id: false,
        timestamp: true,
    }
);


module.exports = mongoose.model('Student', StudentSchema);