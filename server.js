const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 6000;
const app = express()
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const customApiRouter = require('./routes/customApi')
var router = express.Router()

app.use('/api/v1',customApiRouter);
app.use(bodyParser.json())

// const connection_url = "mongodb://localhost:27017/proximity-challenge"
const connection_url = "mongodb+srv://akashms:akashms789@A@cluster0.b1yrq.mongodb.net/proximity-challenge?retryWrites=true&w=majority"

mongoose.set('useFindAndModify', false);

mongoose.connect(connection_url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', function(){  
    console.log("Mongoose default connection is open to ", connection_url);
});

mongoose.connection.on('error', function(err){
    console.log("Mongoose default connection has occured "+err+" error");
});

mongoose.connection.on('disconnected', function(){
    console.log("Mongoose default connection is disconnected");
});

app.listen(port,()=>{ console.log(`App is listening at http://localhost:${port}`) })

process.on('SIGINT', function(){
    mongoose.connection.close(function(){
        console.log("Mongoose default connection is disconnected due to application termination");
        process.exit(0);
    });
});