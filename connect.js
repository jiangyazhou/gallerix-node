var express = require('express');
var connect = express();
var Promise = require('promise');

connect.get('/album', function(req, res) {
    require('./album.js').fetchAlbum(function(arrAlbum){
        res.send(arrAlbum);
    })
})
connect.get('/album/items', function(req, res) {
    require('./album.js').fetchAlbumItems(req.query.href, function(arrItem){
        res.send(arrItem);
    })
})

connect.get('/storeroom', function(req, res) {
    require('./storeroom.js').fetchStoreroom(function(arrStoreroom){
        res.send(arrStoreroom);
    })
})
connect.get('/storeroom/items', function(req, res) {
    require('./storeroom.js').fetchStoreroomItems(req.query.href, function(arrItem){
        res.send(arrItem);
    })
})

connect.get('/museums', function(req, res) {
    require('./museums.js').fetchMuseums(function(arrMuseum){
        res.send(arrMuseum);
    })
})
connect.get('/museums/items', function(req, res) {
    require('./museums.js').fetchMuseumsItems(req.query.href, function(arrItem){
        res.send(arrItem);
    })
})
connect.get('/museums/items/items', function(req, res) {
    require('./museums.js').fetchMuseumsItemsItems(req.query.href, function(arrItem){
        res.send(arrItem);
    })
})

connect.get('/search', function(req, res){
    /*
    require('./search.js').searchItems(req.query.s, function(arrItem){
        res.send(arrItem);
    })
    */
    
    new Promise(function(resolve, reject){
        require('./search.js').searchItems(req.query.s, function(arrItem) {
            resolve(arrItem);
        })
    }).then(function(arrItem) {
        res.send(arrItem);
    });
})


connect.listen(3000, function(req, res) {
    console.log('connect is running at port 3000');
})
