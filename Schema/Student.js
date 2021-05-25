const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    username: String,
    password: String,
    gender:  String,
    age: Number
});

module.exports = mongoose.model('student',studentSchema)
