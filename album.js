var url = require('url');
var eventproxy = require('eventproxy');
var cheerio = require('cheerio');
var async = require('async');
var model = require('./model.js');

var albumUrl = 'https://gallerix.asia/';

function fetchAlbum(callback) {
    console.log("fetchAlbum...");

    var superagent = require('superagent');

    superagent.get(albumUrl)
        .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1')
        .end(function(err, res) {
            if (err) {
                return console.error('fetchAlbums...' + err);
            }

            var arrAlbum = [];
            var $ = cheerio.load(res.text);
            $('td a').each(function(idx, element) {
                var $element = $(element);
                var href = url.resolve(albumUrl, $element.attr("href"));
                var title = $element.find('span').find('h6').text();

                var preview = $element.find('span').find('.preview');
                var background = "https:" + preview.css('background').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
                var quants = preview.find('.quants').text();

                arrAlbum.push({'title': title, 'href': href, 'background': background, 'quants': quants });
            });

            callback(arrAlbum);
        });
}

function fetchAlbumItems(href, callback) {
    console.log("fetchAlbumItems " + href + '...');

    var superagent = require('superagent');
    superagent.get(href)
        .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1')
        .end(function(err, res) {
            if (err) {
                return console.error('fetchAlbumItems...' + err);
            }

            var $ = cheerio.load(res.text);
            var arrItem = [];
            $('td a').each(function(idx, element) {
                var $element = $(element);
                var href = url.resolve(albumUrl, $element.attr("href"));
                var title = $element.text();

                var preview = $element.find('.preview');
                var background = "https:" + preview.css('background').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
                var original = background.replace('/v/', '/sr/');

                arrItem.push({ 'title': title, 'href': href, 'background': background, 'original': original});
            });
            callback(arrItem);
        });
}

exports.fetchAlbum = fetchAlbum;
exports.fetchAlbumItems = fetchAlbumItems;
