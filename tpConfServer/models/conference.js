var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ConfSchema = new Schema({ 
    name: String,
    date : Date,
    debut : String,
    fin: String,
    port: String
});

module.exports = mongoose.model('Conference', ConfSchema);