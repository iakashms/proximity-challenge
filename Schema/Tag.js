const mongoose = require('mongoose')

const tagsSchema = mongoose.Schema({
    name: String,
    description: String,
    created_at : Date,
    created_by : { type: mongoose.Types.ObjectId , ref: 'instructor'},
    is_active : Boolean
});

module.exports = mongoose.model('tag',tagsSchema)
