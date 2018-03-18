var Twit = require('twit');
var config = require('./config.json');

//console.log(config);

var T = new Twit(config);

const regex = /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/;
const str = "https://twitter.com/CNN";
let m;

if ((m = regex.exec(str)) !== null) {
    // The result can be accessed through the `m`-variable.
    var screen_name = m[1]
    console.log(`Searching for tweets by ${m[1]}`);
}

var params = {
    screen_name: screen_name,
    count: 100
    };

T.get('statuses/user_timeline', params, function(err, data, response) {
  var tweet_count = data.length;
  for(var i = 0; i < tweet_count; i++){
    console.log(data[i].text);
  }
});
