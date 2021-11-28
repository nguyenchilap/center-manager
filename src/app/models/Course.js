const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

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
    courseComments: 
        [{
            accountId: {type: Schema.Types.ObjectId}, 
            studentName: {type: String}, 
            studentAvatar: {type: String},
            comment: {type: String},
            commentAt: {type: Date, default: Date.now()},
        }],
    courseStudents: 
        [{
            studentId: {type: Schema.Types.ObjectId},
            result: {type: String, default: 'none'},
            registerAt: {type: Date, default: Date.now()}
        }],
    createBy: {type: Schema.Types.ObjectId, ref:'Manager'},
}, {
    timestamps: true,
} );

//ADD PLUGIN
Course.plugin(mongooseDelete, { 
    deletedAt : true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Course', Course);