var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var albumSchema = new Schema({
    title: String,
    href: String,
    background: String,
    quants: String,
    items: []
});

var storeroomSchema = new Schema({
    name: String,
    items: []
});

var museumSchema = new Schema({
    title: String,
    href: String,
    background: String,
    quants: String,
    items: []
});

exports.album = mongoose.model('Album', albumSchema);
exports.storeroom = mongoose.model('Storeroom', storeroomSchema);
exports.museum = mongoose.model('Museum', museumSchema);
