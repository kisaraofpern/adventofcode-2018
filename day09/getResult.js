const lastMarbleValue = 7151000;
const numElves = 447;

let marbles = 0;
let currentMarbleValue = 0;
const elves = new Array(numElves).fill(0);
const circle = [0];
let currentMarbleIndex = 0;
let currentMarble = 0;
let turns = 0;
let highScore = 0;

for (let i = 0; i < lastMarbleValue; i++) {
  const newMarble = currentMarble + 1;
  turns += 1;

  if (newMarble % 23 === 0) {
    console.log(newMarble);
    const elf = turns % numElves;
    const marbleIndexToRemove = (currentMarbleIndex - 7 + circle.length) % circle.length;
    const marbleToRemove = circle[marbleIndexToRemove];

    currentMarbleValue = newMarble + marbleToRemove;
    elves[elf] += currentMarbleValue;

    circle.splice(marbleIndexToRemove, 1);
    currentMarbleIndex = marbleIndexToRemove;
  } else {
    let clockwiseIndex = (currentMarbleIndex + 2) % circle.length;
    
    if (clockwiseIndex === 0) {
      currentMarbleIndex = circle.length;
      circle.push(newMarble);
    } else {
      circle.splice(clockwiseIndex, 0, newMarble);
      currentMarbleIndex = clockwiseIndex;
    }
  }
  currentMarble = newMarble;
}

for (let i = 0; i < numElves; i ++) {
  if (elves[i] > highScore) {
    highScore = elves[i]
  }
}

console.log(highScore);