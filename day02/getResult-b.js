const fs = require('fs');
const text = fs.readFileSync('input.txt').toString('utf-8');
const input = text.split('\n');

let boxId1, boxId2;

while (!boxId1 && !boxId2) {
  for (let h = 0; h < input.length; h++) {
    let firstId = input[h];
  
    for (let i = h + 1; i < input.length; i++) {
      let secondId = input[i];
      
      if (firstId.length !== secondId.length) break;

      let mismatch = false;
      let progress = 0;
  
      for (let j = 0; j < firstId.length; j++) {
        if (firstId[j] !== secondId[j]) {
          if (mismatch) {
            progress = j;
            break;
          } else {
            mismatch = true;
          }
        }
      }
 
      if (progress === 0) {
        boxId1 = firstId;
        boxId2 = secondId;
        break;
      }
    }
  }
}

console.log(boxId1);
console.log(boxId2);