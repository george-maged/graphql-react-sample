var mongoose = require('mongoose');

var mongoDB = 'mongodb://localhost:27017/gemma';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

var db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error'));