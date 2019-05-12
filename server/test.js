var fs = require('fs');
var b = JSON.parse(fs.readFileSync('synchronous.txt'));
console.log(b.length);
var e = 0;
for(let c in b){
	for(let d in b[c].statuses){
		console.log('-------------');
		console.log(e, b[c].statuses[d].text);
		console.log('-------------');
		e+=1;
	}
}

function standardDeviation(values) {
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}