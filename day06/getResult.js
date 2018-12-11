const fs = require('fs');
const text = fs.readFileSync('input.txt').toString('utf-8');
const input = text.split('\n');

const coordinates = [];
let largestDimension = 0;
const grid = [];
let boundedAreas = [];
let largestBoundedArea;

const safeDistance = 10000; // Manhattan distance to all coordinates must be LESS than this.
const safeDistanceGrid = [];
let safeDistanceArea = 0;

// ========================== PART A ==========================
// Parse coordinates and determine the largest dimension.
for (let i = 0; i < input.length; i++) {
  const coordinatesObject = {};
  let commaIndex = input[i].indexOf(',');
  coordinatesObject.leftOffset = parseInt(input[i].substr(0, commaIndex));
  coordinatesObject.topOffset = parseInt(input[i].substr(commaIndex + 2));
  coordinatesObject.id = i + 1;
  coordinates.push(coordinatesObject);
  boundedAreas.push(coordinatesObject.id);
  
  if ( coordinatesObject.leftOffset > largestDimension ) {
    largestDimension = coordinatesObject.leftOffset
  }

  if ( coordinatesObject.topOffset > largestDimension ) {
    largestDimension = coordinatesObject.topOffset
  }
}

largestDimension = largestDimension += 1;

// Populate the grid with the coordinates.
for (let i = 0; i < largestDimension; i++) {
  grid.push(new Array(largestDimension));
}

// Determine the nearest coordinate for each coordinate in the grid that is empty.
for (let i = 0; i < largestDimension; i++) {   // topOffset
  for (let j = 0; j < largestDimension; j++) { // leftOffset
    const manhattanDistances = {}; // coordinates by distance.
    let nearestDistance;
    for (let k = 0; k < coordinates.length; k++) {
      let distance = Math.abs(i - coordinates[k].topOffset) + Math.abs(j - coordinates[k].leftOffset);

      if ((nearestDistance == null) || (distance < nearestDistance)) {
        nearestDistance = distance;
      }

      if (manhattanDistances[distance]) {
        manhattanDistances[distance].push(coordinates[k].id);
      } else {
        manhattanDistances[distance] = [coordinates[k].id];
      }
    }

    if (manhattanDistances[nearestDistance].length === 1) {
      grid[i][j] = manhattanDistances[nearestDistance][0]
    } else if (manhattanDistances[nearestDistance].length > 1) {
      grid[i][j] = '.'
    }
  }
}

// Determine the coordinates that have areas on the border.
for (let i = 0; i < largestDimension; i++) {
  // Top border --
  if (boundedAreas.includes(grid[0][i])) {
    boundedAreas = boundedAreas.filter((e) => e !== grid[0][i])
  }

  // Right border --
  if (boundedAreas.includes(grid[i][largestDimension - 1])) {
    boundedAreas = boundedAreas.filter((e) => e !== grid[i][largestDimension - 1])
  }

  // Bottom border --
  if (boundedAreas.includes(grid[largestDimension - 1][i])) {
    boundedAreas = boundedAreas.filter((e) => e !== grid[largestDimension - 1][i])
  }

  // Left border --
  if (boundedAreas.includes(grid[i][0])) {
    boundedAreas = boundedAreas.filter((e) => e !== grid[i][0])
  }
}

// Get the largest bounded area size.
for (let i = 0; i < boundedAreas.length; i++) {
  let area = 0;
  for (let j = 0; j < largestDimension; j++) {
    for (let k = 0; k < largestDimension; k++) {
      if (grid[j][k] === boundedAreas[i]) {
        area += 1;
      }
    }
  }

  if (!largestBoundedArea || area > largestBoundedArea) {
    largestBoundedArea = area;
  }
}

console.log(`Answer to Part A: ${largestBoundedArea}`);


// ========================== PART B ==========================
// Populate the "safe distance" grid.
for (let i = 0; i < largestDimension; i++) {
  safeDistanceGrid.push(new Array(largestDimension));
}

// Mark coordinates that are within the safe region.
for (let i = 0; i < largestDimension; i++) {   // topOffset
  for (let j = 0; j < largestDimension; j++) { // leftOffset
    let manhattanDistanceSum = 0;

    for (let k = 0; k < coordinates.length; k++) {
      let distance = Math.abs(i - coordinates[k].topOffset) + Math.abs(j - coordinates[k].leftOffset);
      manhattanDistanceSum += distance;
    }

    if (manhattanDistanceSum < safeDistance) {
      safeDistanceGrid[i][j] = 'x'
      safeDistanceArea += 1;
    }
  }
}

console.log(`Answer to Part B: ${safeDistanceArea}`);