const fs = require('fs');
const text = fs.readFileSync('input.txt').toString('utf-8');
const input = text.split('\n');
const nodes = {};
let stepsInOrder = '';
let unlockedNodes = []; // Nodes that have at least one parent unlocked, but are not fully available.
let openNodes = []; // Nodes that are completely available.
const workers = [
  { stepId: '', stepTimeRemaining: 0 },
  { stepId: '', stepTimeRemaining: 0 },
  { stepId: '', stepTimeRemaining: 0 },
  { stepId: '', stepTimeRemaining: 0 },
  { stepId: '', stepTimeRemaining: 0 },
];
const freeWorkers = [0, 1, 2, 3, 4];
let time = 0;
let durationCorrection = 4; // 64 for test.txt; 4 for input.txt;

// Create object representations for the nodes.
for (let i = 0; i < input.length; i++) {
  const parent = input[i][5];
  const child = input[i][36];

  if (Object.keys(nodes).includes(parent)) {
    nodes[parent].children.push(child);
  } else {
    nodes[parent] = { parents: [] };
    nodes[parent].children = [child];
  }

  if (!Object.keys(nodes).includes(child)) {
    nodes[child] = { parents: [] };
  }
  nodes[child].parents.push(parent);
  if(!nodes[child].children) {
    nodes[child].children = []
  }
}

// Determine initially open nodes.
for (let i = 0; i < Object.keys(nodes).length; i++) {
  const node = Object.keys(nodes)[i];
  if (nodes[node].parents.length === 0) {
    openNodes.push(node);
  }
}
openNodes = openNodes.sort();

while (openNodes.length > 0 || unlockedNodes.length > 0) {
  // If there are no workers or there are no unblocked nodes, increment time until we have at least one free worker and one unblocked node.
  while (openNodes.length === 0 || freeWorkers.length === 0) {
    time += 1;

    for (let i = 0; i < workers.length; i++) {
      if(workers[i].stepTimeRemaining > 0) {
        workers[i].stepTimeRemaining -= 1;
      }

      if (workers[i].stepTimeRemaining === 0 && !!workers[i].stepId) {
        stepsInOrder += workers[i].stepId;
        workers[i].stepId = '';
        freeWorkers.push(i);

        for (let i = 0; i < unlockedNodes.length; i++) {
          let completelyOpen = true;
          for (let j = 0; j < nodes[unlockedNodes[i]].parents.length; j++) {
            if (stepsInOrder.indexOf(nodes[unlockedNodes[i]].parents[j]) < 0) {
              completelyOpen = false;
            }
          }

          if (completelyOpen) {
            openNodes.push(unlockedNodes[i]);
            openNodes = openNodes.sort();
            unlockedNodes = unlockedNodes.filter(node => !openNodes.includes(node));
          }
        }
      }
    }
  }

  if (openNodes.length > 0) {
    workers[freeWorkers[0]].stepId = openNodes[0];
    workers[freeWorkers[0]].stepTimeRemaining = openNodes[0].charCodeAt() - durationCorrection;

    // Add the children for the current node.
    for (let i = 0; i < nodes[openNodes[0]].children.length; i++) {
      if (!unlockedNodes.includes(nodes[openNodes[0]].children[i])) {
        unlockedNodes.push(nodes[openNodes[0]].children[i]);
      }
    }

    openNodes.shift();
    freeWorkers.shift();
  }
}

// Let the last workers finish.
while (freeWorkers.length !== 5) {
  time += 1;

  for (let i = 0; i < workers.length; i++) {
    if(workers[i].stepTimeRemaining > 0) {
      workers[i].stepTimeRemaining -= 1;
    }

    if (workers[i].stepTimeRemaining === 0 && !!workers[i].stepId) {
      stepsInOrder += workers[i].stepId;
      workers[i].stepId = '';
      freeWorkers.push(i);
    }
  }
}

console.log(`Answer to Part B: ${time}`);