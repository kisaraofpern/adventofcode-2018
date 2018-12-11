const fs = require('fs');
const text = fs.readFileSync('input.txt').toString('utf-8');
const versions = [];
const collapsedVersions = [];

// Generate array of versions of input, with different letters stripped.
console.log('Generating an array of versions...');
for (i = 0; i < 26; i++) {
  const lettersToRemove = `[${String.fromCharCode(65 + i)}${String.fromCharCode(97 + i)}]`;
  const regex = new RegExp(lettersToRemove, 'g');
  const newText = text.replace(regex, '');
  versions.push(newText);
}

// Create the collapsed versions.
for (i = 0; i < 26; i++) {
  console.log(`Creating the collapsed version for ${String.fromCharCode(97 + i)}...`);
  let collapsible = true;
  let version = versions[i];

  while(collapsible) {
    for (let i = 0; i < version.length - 1; i++) {
      if( ((version[i].toUpperCase() === version[i+1]) || (version[i] === version[i+1].toUpperCase())) && (version[i] !== version[i+1]) ) {
        const a = version.substr(0, i);
        const b = version.substring(i+2);
        version = a + b;
  
        break;
      }
  
      if (i === version.length - 2) {
        collapsible = false;
      }
    }
  }

  collapsedVersions.push(version);
}

// Find the shortest collapsed version.
console.log('Finding the shortest collapsed version...');
let shortestLength = collapsedVersions[0].length;
for (i = 1; i < 26; i++) {
  if (collapsedVersions[i].length < shortestLength) {
    shortestLength = collapsedVersions[i].length;
  }
}

console.log(shortestLength);
