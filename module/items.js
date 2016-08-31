var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Schema   = new Schema({
    name: String,
    weight: String,
    function : String
});

module.exports = mongoose.model('items', Schema);