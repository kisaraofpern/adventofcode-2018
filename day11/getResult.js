const fuelCells = {};
let gridSerialNumber = 9435;
let totalPower = 0;
let x = 0;
let y = 0;
let size = 0;

const getPowerLevel = (fuelCell) => {
  fuelCell.rackId = fuelCell.posX + 10;
  fuelCell.powerLevel = parseInt(
    Math.floor(
      (((fuelCell.rackId * fuelCell.posY) + fuelCell.serialNumber) * fuelCell.rackId)/100)
    .toString()
    .substr(-1)
  ) - 5;
}

for (let i = 0; i < 300; i++) {
  for (let j = 0; j < 300; j++) {
    fuelCell = {
      posX: i + 1,
      posY: j + 1,
      serialNumber: gridSerialNumber
    }

    getPowerLevel(fuelCell);

    fuelCells[`${i + 1},${j + 1}`] = fuelCell;
  }
}

for (let i = 0; i < 300; i++) {
  for (let j = 0; j < 300; j++) {
    console.log(`i = ${i}, j = ${j}`);

    for (let m = 1; m < 300 - Math.max(i, j); m++) {
      let power = 0;
      // Get the relevant fuel cells.
      for (let k = 0; k < m; k++) {   // x
        for (let l = 0; l < m; l++) { // y
          try {
            power += fuelCells[`${k + i + 1},${l + j + 1}`].powerLevel
          } catch (err) {
            console.log(`Error at i = ${i}, j = ${j}, k = ${k}, l = ${l}`);
            throw err;
          }
        }
      }
  
      if (power > totalPower) {
        totalPower = power;
        x = i + 1;
        y = j + 1;
        size = m;
      }
    }
  }
}

console.log(`totalPower: ${totalPower}`);
console.log(`(x, y, size): (${x}, ${y}, ${size})`);
