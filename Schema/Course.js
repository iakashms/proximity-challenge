const mongoose = require('mongoose')

const courseSchema = mongoose.Schema({
    name: String,
    description: String,
    subjects_involved: Array,
    created_at : Date,
    view_count : Number,
    created_by : { type: mongoose.Types.ObjectId , ref: 'instructor'},
    is_active : Boolean
});

module.exports = mongoose.model('course',courseSchema)
