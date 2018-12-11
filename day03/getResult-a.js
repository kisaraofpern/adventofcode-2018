const fs = require('fs');
const text = fs.readFileSync('input.txt').toString('utf-8');
const input = text.split('\n');
const claims = []; // id, leftOffset, topOffset, width, height
let overlappingAreas = 0;
let cleanClaims = [];

// Generate objects representing the claims.
for (let i = 0; i < input.length; i++) {
  const elements = input[i].split(' ');
  const claimObject = {};

  claimObject['id'] = parseInt(elements[0].substr(1));

  let commaIndex = elements[2].indexOf(',');
  claimObject['leftOffset'] = parseInt(elements[2].substr(0, commaIndex));
  claimObject['topOffset'] = parseInt(elements[2].substr(commaIndex + 1, elements[2].length - commaIndex - 2));

  let xIndex = elements[3].indexOf('x');
  claimObject['width'] = parseInt(elements[3].substr(0, xIndex));
  claimObject['height'] = parseInt(elements[3].substr(xIndex + 1, elements[2].length - xIndex));

  claims.push(claimObject);
}

// Generate empty grid.
const grid = [];
for (let i = 0; i < 1000; i++) {
  const row = new Array(8);
  grid.push(row);
}

// Fill the grid.
for (let i = 0; i < claims.length; i++) {
  let claim = claims[i];
  let completelyClaimedArea = 0;
  for (let j = 0; j < claim['height']; j++) {
    for (let k = 0; k < claim['width']; k++) {
      let row = claim['topOffset'] + j;
      let column = claim['leftOffset'] + k
      if (!grid[row][column]) {
        grid[row][column] = claim['id']
        completelyClaimedArea += 1;
      } else if (grid[row][column] !== 'x') {
        cleanClaims = cleanClaims.filter((v) => v !== grid[row][column]);
        grid[row][column] = 'x'
        overlappingAreas += 1;
      }
    }
  }

  if (completelyClaimedArea === claim['height']*claim['width']) {
    cleanClaims.push(claim['id']);
  }
}

console.log(cleanClaims);