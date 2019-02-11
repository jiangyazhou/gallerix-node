var url = require('url');
var eventproxy = require('eventproxy');
var cheerio = require('cheerio');
var async = require('async');
var model = require('./model.js');

var albumUrl = 'https://gallerix.asia/';

function fetchStoreroom(callback) {
    console.log('fetchStoreroom...');
    var storeroomUrl = 'https://gallerix.asia/storeroom/';
    var superagent = require('superagent');
    superagent.get(storeroomUrl)
        .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1')
        .end(function(err, res) {
            if (err) {
                return console.error('fetchStoreRoom...' + err);
            }

            var $ = cheerio.load(res.text);
            var arrItem = [];
            $('.well').each(function(idx, element) {
                var $element = $(element);

                var arrLi = [];
                var li = $element.next();
                while (li.is('li')) {
                    var a = li.find('a');
                    arrLi.push({'name' : a.text(), 'href' : url.resolve(albumUrl, a.attr('href'))});
                    li = li.next();
                }

                var a = $element.find('span').find('a');
                var href = url.resolve(albumUrl, a.attr('href'));
                var name = a.attr('name');
                arrItem.push({ 'href': href, 'name': name, 'items' : arrLi})
            });

            callback(arrItem);
        });
}

function fetchStoreroomItems(href, callback) {
    console.log('fetchStoreroomItems...' + href);

    var superagent = require('superagent');
    superagent.get(href)
        .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1')
        .end(function(err, res) {
            if (err) {
                return console.error('fetchStoreroomItems...' + err);
            }

            var $ = cheerio.load(res.text);
            var arrItem = [];
            $('td a').each(function(idx, element) {
                var $element = $(element);

                var preview = $element.find('.preview');
                var background = "https:" + preview.css('background').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
                var original = background.replace('/v/', '/sr/');
                arrItem.push({'background': background, 'original': original });
            });

            callback(arrItem);
        });
}

exports.fetchStoreroom = fetchStoreroom;
exports.fetchStoreroomItems = fetchStoreroomItems;