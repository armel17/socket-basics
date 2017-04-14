var moment = require('moment');
var now = moment();

console.log(now.format());
console.log(now.format('X'));   // seconds
console.log(now.format('x'));   // milli-seconds
console.log(now.valueOf());   // milli-seconds as number

var timestamp = 1492161625796;
var timestampMoment = moment.utc(timestamp).local();    // GMT

console.log(timestampMoment.format('h:mm a'));

//now.subtract(1, 'year');    // add
//
//console.log(now.format());
//console.log(now.format('MMM Mo YYYY, h:mm a'));