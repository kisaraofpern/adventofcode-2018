const fs = require('fs');
const text = fs.readFileSync('input.txt').toString('utf-8');
const input = text.split(' ').map(e => parseInt(e));
let sum = 0;

fd = fs.openSync('output.txt', 'a');

const buildNode = (input) => {
  if (input[0] === 0) {
    let value = 0;
    node = { 
      numChildren: input[0],
      numMetadata: input[1],
      children: [],
      metadata: input.slice(2, 2 + input[1]),
      inputLength: input[1] + 2,
      metadataCounted: false
    }

    node.metadata.forEach(e => value += e);
    node.value = value;
    return node;
  } else {
    const nodes = [];
    let originalInput = input;

    while (nodes.length < input[0]) {
      const child = buildNode(input.slice(2));
      nodes.push(child);
      input = input.slice(0, 2).concat(input.slice(2 + child.inputLength));
      if (!child.metadataCounted) {
        child.metadata.forEach(e => sum += e);
        child.metadataCounted = true
      }
    }

    const numMetadata = originalInput[1];
    let totalLength = 0;
    nodes.forEach(n => totalLength += n.inputLength);  
    nodes.forEach(n => fs.appendFileSync('output.txt', `${n.value}\n`));
    const metadata = originalInput.slice(2 + totalLength, 2 + totalLength + numMetadata);
    metadata.forEach(e => sum += e);
    const inputLength = 2 + totalLength + numMetadata;

    let value = 0;
    metadata.forEach(e => {
      if (nodes[e - 1]) {
        value += nodes[e-1].value;
      }
    });
    
    return { 
      numChildren: input[0],
      numMetadata: input[1],
      children: nodes,
      metadata,
      inputLength,
      metadataCounted: true,
      value
    }
  }
}

node = buildNode(input);
console.log(`Answer to part A: ${sum}`);
console.log(`Answer to part B: ${node.value}`);