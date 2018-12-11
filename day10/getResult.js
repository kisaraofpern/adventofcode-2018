const fs = require('fs');
const text = fs.readFileSync('input.txt').toString('utf-8');
const input = text.split('\n');
const points = []; // { posX, posY, velX, velY }
let width, height, oldWidth, oldHeight, zeroX, zeroY;
let t = 0;

const outputFile = fs.createWriteStream('./output.txt');

// Generate objects for points.
for (let i = 0; i < input.length; i++) {
  const point = {};
  const position = input[i].match(/\-*\d+,\s*\-*\d+/g)[0];
  const velocity = input[i].match(/\-*\d+,\s*\-*\d+/g)[1];

  let commaIndex = position.indexOf(',');
  point.posX = parseInt(position.substr(0, commaIndex));
  point.posY = parseInt(position.substr(commaIndex + 1));

  commaIndex = velocity.indexOf(',');
  point.velX = parseInt(velocity.substr(0, commaIndex));
  point.velY = parseInt(velocity.substr(commaIndex + 1));

  points.push(point);
}

// Determine the size of the grid.
const getGridSize = () => {
  const xValues = [];
  const yValues = [];
  points.map(point => xValues.push(point.posX))
  points.map(point => yValues.push(point.posY))
  xValues.sort((a,b) => a - b);
  yValues.sort((a,b) => a - b);
  
  width = xValues[xValues.length - 1] - xValues[0] + 1;
  height = yValues[yValues.length - 1] - yValues[0] + 1;
  zeroX = -xValues[0];
  zeroY = -yValues[0];
}

// Generate the grid.
const printGrid = () => {
  console.log('Printing grid...');

  for (let i = 0; i < height; i++) {
    // Get the points for this row.
    const filteredPoints = points.filter(point => point.posY + zeroY === i);
    const filteredPointsX = [];
    filteredPoints.map(point => filteredPointsX.push(point.posX + zeroX));
    filteredPointsX.sort((a,b) => a - b);

    let gridRepresentation = '';
    // Print this row.
    if (filteredPointsX.length !== 0) {
      for (let j = 0; j < width; j++) {
        if (filteredPointsX.includes(j)) {
          gridRepresentation += 'X';
        } else {
          gridRepresentation += ' ';
        }
      }
    }

    outputFile.write(`${gridRepresentation}\n`);
  }
}

const transformPoints = () => {
  for (i = 0; i < points.length; i++) {
    points[i].posX = points[i].posX + points[i].velX;
    points[i].posY = points[i].posY + points[i].velY;
  }
}

getGridSize();
// oldHeight = height;
oldWidth = width;

while (oldWidth >= width) {
  t += 1;
  oldWidth = width;
  transformPoints();
  getGridSize();
}

// Go back by one transform.
for (i = 0; i < points.length; i++) {
  points[i].posX = points[i].posX - points[i].velX;
  points[i].posY = points[i].posY - points[i].velY;
}

t -= 1;
getGridSize();
printGrid();

outputFile.write(`\n\n`);
outputFile.end();

console.log(t);