const fs = require('fs');
let sum = 0;
let calibrate;
const sums = [];

const text = fs.readFileSync('input.txt').toString('utf-8');
const input = text.split('\n');

while(calibrate === undefined || calibrate === null) {
  for (let i = 0; i < input.length; i++) {
    sum += parseInt(input[i]);
    if (sums.includes(sum)) {
      calibrate = sum;
      break;
    } else {
      sums.push(sum);
    }
  }
}

console.log(calibrate);