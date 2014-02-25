var request = require('request'),
  cheerio = require('cheerio'),
  async = require('async'),
  exec = require('child_process').exec;

var USERNAME = ''; 

function fetchChallenges(callback) {

  request('http://vimgolf.com/', function(err, res, body) {
    var $ = cheerio.load(body),
      output = [];
    $('div.grid_7 > div').each(function() {
      var $this = $(this),
        url = $this.find('a').attr('href');
      output.push({
        "url": url,
        "description": $this.find('p').html()
      });
    });

    callback(null, output);
  });

}

function fetchCompletedChallenges(callback) {

  request('http://vimgolf.com/' + USERNAME, function(err, res, body) {

    var $ = cheerio.load(body),
      output = {},
      completed = [];
    $('div.grid_7 > div').each(function() {
      var $this = $(this);
      completed.push($this.find('a').attr('href'));
    });
    callback(null, completed);
  });

}

async.parallel([fetchChallenges, fetchCompletedChallenges], function(err, results) {
  var completedChallenges = results[1],
    allChallenges = results[0],
    uncompletedChallenges = allChallenges.filter(function(challenge) {
      return completedChallenges.indexOf(challenge.url) === -1;
    });

  uncompletedChallenges.forEach(function(challenge) {
    console.log('');
    console.log('http://vimgolf.com' + challenge.url);
    console.log(challenge.description);
    console.log('');
  });
});
