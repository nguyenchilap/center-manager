const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Course = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    img: {type: String, default: 'none'},
    level: {type: String},
    price: {type: Number},
    slug: { type: String, slug: 'name', unique: true },
    courseTypes : [],
    courseLessons: [],
    createBy: {type: Schema.Types.ObjectId, ref:'Manager'},
}, {
    timestamps: true,
} );

//ADD PLUGIN
// mongoose.plugin(slug);

module.exports = mongoose.model('Course', Course);