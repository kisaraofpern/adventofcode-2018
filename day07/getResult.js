const fs = require('fs');
const text = fs.readFileSync('input.txt').toString('utf-8');
const input = text.split('\n');
const nodes = {};
let stepsInOrder = '';
let currentNode;
let unlockedNodes = []; // Nodes that have at least one parent unlocked, but are not fully available.
let openNodes = []; // Nodes that are completely available.

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

// Determine starting node.
for (let i = 0; i < Object.keys(nodes).length; i++) {
  const node = Object.keys(nodes)[i];
  if (nodes[node].parents.length === 0) {
    openNodes.push(node);
    if (!currentNode || node < currentNode) {
      currentNode = node;
    }
  }
}
stepsInOrder = currentNode;
openNodes = openNodes.sort();
openNodes.shift();

while (openNodes.length > 0 || unlockedNodes.length > 0 || nodes[currentNode].parents.length === 0) {
  // Add the children for the current node.
  for (let i = 0; i < nodes[currentNode].children.length; i++) {
    if (!unlockedNodes.includes(nodes[currentNode].children[i])) {
      unlockedNodes.push(nodes[currentNode].children[i]);
    }
  }

  // Determine if which unlocked nodes are open.
  for (let i = 0; i < unlockedNodes.length; i++) {

    let completelyOpen = true;
    for (let j = 0; j < nodes[unlockedNodes[i]].parents.length; j++) {
      if (stepsInOrder.indexOf(nodes[unlockedNodes[i]].parents[j]) < 0) {
        completelyOpen = false;
      }
    }

    if (completelyOpen) {
      openNodes.push(unlockedNodes[i]);
    }
  }

  openNodes = openNodes.sort();
  unlockedNodes = unlockedNodes.filter(node => !openNodes.includes(node));

  // Perform the next alphabetically open node.
  stepsInOrder += openNodes[0];
  currentNode = openNodes[0];
  openNodes.shift();
}

console.log(`Answer to Part A: ${stepsInOrder}`);