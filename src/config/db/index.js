const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect('mongodb://localhost:27017/edu_center_management', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect Database Succesfully!!!');
    }
    catch{
        console.log('Connect Database Failed!!!');
    }
}

module.exports = { connect };