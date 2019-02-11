var cheerio = require('cheerio');
var url = require('url');

var albumUrl = 'https://gallerix.asia/';
var searchUrl = 'https://gallerix.asia/search/';

function searchItems(param, callback)
{
    console.log('searchItems...');

    var superagent = require('superagent');
    superagent.post(searchUrl)
        .type('form')
        .send({'q' : param})
        .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1')
        .end(function(err, res) {
            if (err) {
                return console.error('searchItems...' + err);
            }

            var $ = cheerio.load(res.text);
            var navstacked = $('.container .nav-stacked');
            var arrli0 = navstacked.find('li');
            var arrli1 = navstacked.find('.nav-stacked').find('li');

            var arrItem = [];
            var arrItem0 = [];
            var arrItem1 = [];
            arrli0.each(function(idx, element){
                var $element = $(element);
                var a = $element.find('a');
                var href = url.resolve(albumUrl, a.attr('href'));
                var title = a.find('span').text();
                var background = a.find('img').attr('src');
                arrItem0.push({'title' : title, 'href' : href, 'background' : background});
            });
            arrli1.each(function(idx, element){
                var $element = $(element);
                var a = $element.find('a');
                var href = url.resolve(albumUrl, a.attr('href'));
                var title = a.find('span').text();
                var background = a.find('img').attr('src');
                var original = background.replace('/v/', '/sr/');

                arrItem1.push({'title' : title, 'href' : href, 'background' : background, 'original' : original});
            });

            arrItem.push(arrItem0);
            arrItem.push(arrItem1);

            callback(arrItem);
        });
}

exports.searchItems = searchItems;