const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect('mongodb+srv://lap18620:Lapboy20@cluster0.ogmkg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
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