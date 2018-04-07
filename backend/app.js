var express = require('express');
var app = express();
var fs = require('fs');
var Twit = require("twit");

// import word list
abusive_json = require('./word_list/abusive_final_combined.json')
abusive_list = abusive_json.map(function(d) { return d.words })

// for twitter api
var T = new Twit({
    "consumer_key": "ULVFOWWRwPBG31JmCSk3pA9WY",
    "consumer_secret": "GkpPuajWIi8OwFNHJMnKaAvLBCQcQZdiNnEViM44eqvTvAXkf7",
    "access_token": "973403711518183425-CNAn0AQYiT074O0XyALXdU2LiJUzGSg",
    "access_token_secret": "s986l8COxFydEgyOCSuHrtGRSldyunsKfZh59TRyx1tVd"
});



// Set up a URL route
app.get("/", function(req, res) {
 res.send("Heroku Demo!");
});



app.get('/tpi', function(req, res) {
    var user = req.query.user;
    var request_number = req.query.numberTwit ? parseInt(req.query.numberTwit): 200;

    console.log('request_number',request_number)
    obtainTweets(user, request_number, undefined, null, res, find_abusive)
});


function obtainTweets(screen_name, number, lastId, dataset, res, callback) {

    // setting params
    var params = {
        screen_name: screen_name,
        count: 200,
    };
    if (typeof lastId != "undefined") params.max_id = lastId;

    dataset = dataset || []
    // if we have got enough data, end the data collection and run the callback function
    if (number <= 0) return callback(null, dataset,res)
    
    // run Twitter API
    return T.get('statuses/user_timeline', params, function(err, data, response) {
        if (err) {
            console.log('Twitter search failed!');
            return callback(err,[],res);
        }
        if (data.length>0) {
            // no more new data
            if (lastId==data[data.length - 1].id_str ) {
                console.log('All Posts have found');
                return callback(null,dataset, res);
            }

            lastId = parseInt(data[data.length - 1].id_str);
            console.log('new lastId',lastId)
            
            // concat data
            dataset = dataset.concat(data)
            return obtainTweets(screen_name, number - 200, lastId, dataset, res, callback)
        }
    })
}

// callback function
function find_abusive(error, data, res) {

        if (error) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ error: true, error_msg: error['message'] }));
        } else {
            console.log('here')
            var giant_string = '';
            if (data.length > 0) {
                // make giant string
                for (i = 0; i < data.length; i++) {
                    giant_string = giant_string.concat(data[i]["text"]);
                }

                giant_string = giant_string.toLowerCase().replace(/\W+/g, " ")
                var total_count = 0;
                var abusive_list_count = {};

                for (i = 0; i < abusive_list.length; i++) {
                    var keywords = abusive_list[i]
                    //var reg = new RegExp(keywords, "i");
                    var reg = new RegExp("\\b" + keywords + "\\b", 'i')
                    var word_count = (giant_string.match(reg) || []).length;
                    total_count = total_count + word_count;
                    if (keywords in abusive_list_count) {
                        abusive_list_count[keywords] = abusive_list_count[keywords]+word_count

                    } else {
                        abusive_list_count[keywords] = word_count
                    }
                    
                    //console.log(keywords,word_count);
                }

                var word_ratio = total_count / giant_string.length
                var abusive_user = word_ratio > 0.002 ? true : false;
                var abusive_list_count_sort = Object.entries(abusive_list_count).sort(function(a, b) { return b[1] - a[1] }).slice(0, 5)
                console.log('-----------------------------------------------------------')
                console.log('total count; ', total_count)
                console.log('ratio: ', word_ratio)
                console.log('abusive_list_count_sort: ', abusive_list_count_sort)


                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ error: false, error_msg: '', word_count: total_count, word_ratio: word_ratio, abusive_user: abusive_user, abusive_list_count_10: abusive_list_count_sort.map(function(d){return d[0]}) }));

            } else {
                error_msg = 'no twitter data has found for '.concat(screen_name)
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ error: true, error_msg: error_msg }));
            }
        }
}

// bind the app to listen for connections on a specified port
var port = process.env.PORT || 3000;
app.listen(port);

// Render some console log output
console.log("Listening on port " + port);