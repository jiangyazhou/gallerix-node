var url = require('url');
var eventproxy = require('eventproxy');
var cheerio = require('cheerio');
var async = require('async');
var model = require('./model.js');

var albumUrl = 'https://gallerix.asia/';
var museumsUrl = 'https://gallerix.asia/album/Museums';

function fetchMuseums(callback) {
    console.log("fetchMuseums...");

    var superagent = require('superagent');

    superagent.get(museumsUrl)
        .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1')
        .end(function(err, res) {
            if (err) {
                return console.error('fetchMuseums...' + err);
            }

            var arrMuseum = [];
            var $ = cheerio.load(res.text);
            $('td a').each(function(idx, element) {
                var $element = $(element);
                var href = url.resolve(museumsUrl, $element.attr("href"));
                var title = $element.find('span').text();

                var preview = $element.find('span').find('.preview');
                var background = preview.css('background').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
                var quants = preview.find('.quants').text();

                arrMuseum.push({ 'title': title, 'href': href, 'background': background, 'quants': quants });
            });

            callback(arrMuseum);
        });
}

function fetchMuseumsItems(href, callback) {
    console.log("fetchMuseumsItems " + href + '...');

    var superagent = require('superagent');
    superagent.get(href)
        .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1')
        .end(function(err, res) {
            if (err) {
                return console.error('fetchMuseumsItems...' + err);
            }

            var $ = cheerio.load(res.text);
            var arrItem = [];

            $('tr td a').each(function(idx, element) {
                var $element = $(element);
                var itemhref = url.resolve(albumUrl, $element.attr("href"));
                var itemtitle = $element.find('span').text();
                var preview = $element.find('.preview');
                var itembackground = "https:" + preview.css('background').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
                var itemquants = preview.find('.quants').text();

                if(itemtitle.length > 0 && itemquants.length > 0) {
                    arrItem.push({ 'title': itemtitle, 'href': itemhref, 'background': itembackground, 'quants': itemquants });
                } else {
                    var itemoriginal = itembackground.replace('/v/', '/sr/');
                    arrItem.push({ 'background': itembackground, 'original': itemoriginal });
                }
            });

            callback(arrItem);
        });
}

function fetchMuseumsItemsItems(href, callback) {
    console.log("fetchMuseumsItemsItems " + href + '...');

    var superagent = require('superagent');
    superagent.get(href)
        .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1')
        .end(function(err, res) {
            if (err) {
                return console.error('fetchMuseumsItemsItems...' + err);
            }

            var $ = cheerio.load(res.text);
            var arrItem = [];

            $('tr td a').each(function(idx, element) {
                var $element = $(element);
                var title = $element.text();
                var preview = $element.find('.preview');
                var background = "https:" + preview.css('background').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
                var original = background.replace('/v/', '/sr/');

                arrItem.push({ 'title': title, 'background': background, 'original' : original});
            });

            callback(arrItem);
        });
}

exports.fetchMuseums = fetchMuseums;
exports.fetchMuseumsItems = fetchMuseumsItems;
exports.fetchMuseumsItemsItems = fetchMuseumsItemsItems;
