const mongoose = require('mongoose')

const instructorSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    username: String,
    password: String,
    gender:  String,
    age: Number,
    // subjects_handeled : [mongoose.Types.ObjectId]
    subjects_handeled : { type: [mongoose.Types.ObjectId] , ref: 'subject'},
});

module.exports = mongoose.model('instructor',instructorSchema)
