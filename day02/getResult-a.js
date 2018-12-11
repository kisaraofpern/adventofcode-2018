const fs = require('fs');
const text = fs.readFileSync('input.txt').toString('utf-8');
const input = text.split('\n');

let doubleLetter = 0;
let tripleLetter = 0;
let hasDoubleLetter;
let hasTripleLetter;

for (let i = 0; i < input.length; i++) {
  let string = input[i];
  const library = {};
  hasDoubleLetter = false;
  hasTripleLetter = false;
  for (let j = 0; j < string.length; j++) {
    let letter = string[j];
    if (!Object.keys(library).includes(letter)) {
      library[letter] = 0;
    }
    library[letter] += 1;
  }
  for (let letter in library) {
    if (library[letter] === 2) {
      hasDoubleLetter = true;
    }

    if (library[letter] === 3) {
      hasTripleLetter = true;
    }
  }

  if(hasDoubleLetter) doubleLetter += 1;
  if(hasTripleLetter) tripleLetter += 1;
}

console.log(doubleLetter * tripleLetter);