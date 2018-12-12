const fs = require('fs');
const text = fs.readFileSync('input.txt').toString('utf-8');
const input = text.split('\n');
let state;
const growthRate = {};
const generations = [];
const numGenerations = 50000000000;
let startingIndex = 0;
let sum = 0;
let stableState = false;
let stableGeneration = 0;

console.log('Getting initial state and growth rates...');
for (let i = 0; i < input.length; i++) {
  if (input[i].indexOf('initial state') > -1) {
    state = input[i].match(/[\#\.]+/g)[0];
    generations.push(state);
  }

  if (input[i].indexOf('=>') > -1) {
    const pattern = input[i].substr(0, 5);
    growthRate[pattern] = input[i].substr(-1)
  }
}

console.log('Growing the plants...');
for ( i = 0; i < numGenerations; i++) {
  if ( i % 1000000000 === 0 ) {
    console.log(`On generation ${i}...`);
  }
  // Copy the state, adding leading and trialing pots.
  const lastGeneration = `....${state}....`;

  // Build the next generation. ... until it stabilises.
  let nextGeneration = '';
  if (!stableState) {
    for (j = 2; j < state.length + 6; j++) {
      const pots = lastGeneration.substr(j-2, 5);
      nextGeneration += growthRate[pots] || '.'
    
    }
    state = nextGeneration.match(/\#.+\#/g)[0];
    const leadingPots = nextGeneration.match(/^\.+/g)[0].length;
    startingIndex = startingIndex - 2 + leadingPots;

    if (lastGeneration === `....${state}....`) {
      console.log('Stable state found...');
      stableState = true;
      stableGeneration = i;
      break;
    }
  }
}

// Fast-forward the starting index through the rest of the generations.
startingIndex = startingIndex + numGenerations - stableGeneration - 1;

console.log('Summing the plants...');
for ( i = 0; i < state.length; i++ ) {
  if (state.charAt(i) === '#') {
    sum += startingIndex + i;
  }
}

console.log(`Sum of numbers of planted pots: ${sum}`);