var album = require('./album.js');
var storeroom = require('./storeroom.js');
var museums = require('./museums.js');

if (module === require.main) {
    album.fetchAlbum(function(arrAlbum){
    	
    });
    storeroom.fetchStoreroom(function(arrStoreitem){
    	
    });
    museums.fetchMuseums(function(arrMuseum){

    });
}
