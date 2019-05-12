var express = require('express');
var app = express();
var cors = require("cors");
var T = require('./twitter');
var sw = require("stopword");

app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

app.get('/', function (req, res) {
  res.send('Hello World!!');
});

var Sentiment = require('sentiment');
var sentiment = new Sentiment();
var log = [];
var fs = require('fs');
var stream = fs.createWriteStream("my_file.txt");

function standardDeviation(values){
  var avg = average(values);
  var pos = 0, neg = 0, neu = 0;
  for(let i in values){
    pos += values[i]>0;
    neg += values[i]<0;
    neu += values[i]==0;
  }
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return {avg, stdDev, pos, neg, neu, length: values.length};
}

function topwords(words){
  var pos_counts = {}, neg_counts = {};
  for(let i in words){
    pos_counts[words[i][0]] = pos_counts[words[i][0]]||0;
    pos_counts[words[i][0]] += 1;
    neg_counts[words[i][1]] = neg_counts[words[i][1]]||0;
    neg_counts[words[i][1]] += 1;
  }
  var pos_array = [], neg_array = [];
  for(let i in pos_counts){
    if (pos_counts[i] > 1 && i.length > 1) {
      pos_array.push([pos_counts[i],i]);
    }
  }
  for(let i in neg_counts){
    if (neg_counts[i] > 1 && i.length > 1) {
      neg_array.push([neg_counts[i],i]);
    }
  }
  pos_array.sort(function(a,b){
    var x = a[0]; var y = b[0];
    return ((x < y) ? 1 : ((x > y) ? -1 : 0));
  });
  neg_array.sort(function(a,b){
    var x = a[0]; var y = b[0];
    return ((x < y) ? 1 : ((x > y) ? -1 : 0));
  });
  const ws = pos_array
    .concat(neg_array)
    .sort((a, b) => b[0] - a[0])
    .slice(0, 6)
    .map(x => x[1]);

  return sw.removeStopwords(ws);
}

function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}

function convertReq(str){
  var strs = str.substr(1).split('&');
  var req = {};
  for(let i in strs){
    var ss = strs[i].split('=');
    req[ss[0]] = ss[1];
  }
  console.log(req);
  return req['max_id'];
}

function queryTwitter(req, all_data, res, level = 0){
  T.get('search/tweets', req, function(err, data, response) {
    console.log(data.statuses);
    console.log("queryTwitter", req, level, data.statuses.length);
    console.log('----------------------------------');
    log.push(data);
    console.log(log.length);
    if(err){
      res.send(err);
    }else{
      //res.send(data);
      if(data.statuses.length==0||level>=5){
        console.log("data.search_metadata.max_id", data.search_metadata.max_id, level);
        console.log("data.search_metadata.next_results", data.search_metadata.next_results, level);
        const analysis = all_data.map(x => [x.text, sentiment.analyze(x.text)]);
        all_data.sort((a, b) => b.total - a.total);
        fs.writeFileSync("synchronous.txt", JSON.stringify(log));
        fs.writeFileSync("synchronous2.txt", JSON.stringify(analysis));
        const result = {
          sd: standardDeviation(analysis.map(x=>x[1].score)),
          topWords: topwords(analysis.map(x=>[x[1].positive, x[1].negative])),
          topTweets: all_data
            .slice(0, 3)
            .map(x => ({...x, sentiment: sentiment.analyze(x[0]).score})),
        };

        console.log("--- result ---");
        console.log(result);
        result.topTweets.forEach(t => {
          console.log(t.user);
        })
        res.send(JSON.stringify(result));
      }else{
        const tweets = data.statuses.map(x => ({
          text: x.text,
          likes: x.favorite_count,
          rts: x.retweet_count,
          total: x.favorite_count + x.retweet_count,
          user: {
            pic: x.user.profile_image_url_https,
            name: x.user.screen_name,
            location: x.user.location || ""
          }
        }));

        console.log("data.search_metadata.max_id", data.search_metadata.max_id, level);
        console.log("data.search_metadata.next_results", data.search_metadata.next_results, level);
        //queryTwitter(convertReq(data.search_metadata.next_results), all_data, res, level+1);
        queryTwitter({...req, ...{max_id:convertReq(data.search_metadata.next_results)}}, all_data.concat(tweets), res, level+1);
      }
    }
  });
}

app.get('/twitter', function (req, res) {
  console.log('url: ' + req.query.url);
  //get the whole query as!
  var queryStuff = JSON.stringify(req.query.url);
  //console.log(queryStuff);
  var new_req = req.query;
  new_req.q = new_req.url+' -filter:retweets AND -filter:replies'
  console.log(new_req);
  queryTwitter({...new_req,...{ }}, [], res);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
