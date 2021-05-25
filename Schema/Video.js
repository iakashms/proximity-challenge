const mongoose = require('mongoose')

const videoSchema = mongoose.Schema({
    title: String,
    description: String,
    file_name : String,
    path: String,
    view_count : Number,
    uploaded_at : Date,
    uploaded_by : { type: mongoose.Types.ObjectId , ref: 'instructor'},
    tag : { type: mongoose.Types.ObjectId , ref: 'tag'},
    course : { type: mongoose.Types.ObjectId , ref: 'course'},
    subject : { type: mongoose.Types.ObjectId , ref: 'subject'},
    video_type : String
});

module.exports = mongoose.model('video',videoSchema)
