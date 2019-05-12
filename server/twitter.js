/**
 * Created by wangyue on 2019-04-13.
 */

var Twit = require('twit');

// var config = require('./config');

var T = new Twit({
    consumer_key:         'wWPAsuehKvc4uO1Uvsmc8OklW',
    consumer_secret:      'iY4kz9vpVENlarZQM0L9NO7zPugp5lyoVzXkRFpjM2KH3wcAxo',
    access_token:         '816196281034940416-WnFnuKNSL42ZkPydBoGcA7Kpim6t7R0',
    access_token_secret:  'ApOSe9RVVtTzGSPeW0MUEO3NOYkvdRANRFNZb9PDnblV7',
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL:            true     // optional - requires SSL certificates to be valid.
});

// var params = {
//     q: 'https://www.cnn.com/2019/04/12/politics/illinois-president-tax-returns/index.html -filter:retweets AND -filter:replies',
//     count: 10
// }

// T.get('search/tweets', params, searchedData);

// var text;

// function searchedData(err, data, response) {
//     if(err) {
//         console.log('Error: ' + err);
//     }
//     else {
//     	console.log(data);
//         for( i = 0; i < data.statuses.length; i++) {
//             var temp = data.statuses[i];

//             console.log(temp);
//             // var temp = data.statuses[i].text.split(" ")[0]
//             // if(temp.length > 0) {
//             //     text += temp[0] + '\n'
//             //     console.log(temp[0])
//             // }
//         }
//         // console.log(text)
//     }
// }

module.exports = T;