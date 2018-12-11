const fs = require('fs');
const text = fs.readFileSync('input.txt').toString('utf-8');
const input = text.split('\n').sort();
const shifts = []; // hour, shiftDay, guardId
let currentShift;
const guardNapMinutes = {}; // Number of minutes slept per guard.
let sleepiestGuard;
let sleepiestShifts;
const sleepiestShiftsCumulative = []; // Times slept per minute for the sleepiest guard.
let sleepyMinutes;
let sleepiestMinute;
const sleepiestMinuteCumulative = [];

// Generate objects representing each day.
for (let i = 0; i < input.length; i ++) {
  const element = input[i];

  const minute = parseInt(element.match(/(\d{2}\:\d{2})/g)[0].substr(3, 2));
  if (element.indexOf('Guard') > 0) {
    if (currentShift) {
      shifts.push(currentShift);
    }

    currentShift = {
      hour: new Array(60),
    }

    const year = parseInt(element.match(/\d{4}/));
    const month = parseInt(element.match(/\b\d{2}-\d{2}/g)[0].substr(0, 2)) - 1;
    const day = parseInt(element.match(/\b\d{2}-\d{2}/g)[0].substr(3, 2));
    const hour = parseInt(element.match(/(\d{2}\:\d{2})/g)[0].substr(0, 2));
  
    const time = new Date(year, month, day, hour, minute);
    const midnight = new Date(year, month, day, 0, 0);
    const nextDay = new Date(year, month, day + 1, 0, 0);
    const lastDay = new Date(year, month, day - 1, 0, 0);
    let shiftHour;

    const midnightDifference = Math.abs(midnight - time);
    const nextDayDifference = Math.abs(nextDay - time);
    const lastDayDifference = Math.abs(lastDay - time);

    const difference = Math.min(midnightDifference, nextDayDifference, lastDayDifference);

    if (difference === midnightDifference) {
      shiftHour = midnight;
    } else if (difference === nextDayDifference) {
      shiftHour = nextDay;
    } else {
      shiftHour = lastDay;
    }

    const shiftDay = `${shiftHour.getMonth() + 1}-${shiftHour.getDate()}`;

    currentShift.shiftDay = shiftDay;
    currentShift.guardId = parseInt(element.match(/(\d+)/g)[element.match(/(\d+)/g).length - 1]);
  }
  
  if (element.indexOf('falls asleep') > 0) {
    sleepMinute = minute;
    wakeMinute = parseInt(input[i+1].match(/(\d{2}\:\d{2})/g)[0].substr(3, 2));

    for (let j = sleepMinute; j < wakeMinute; j++) {
      currentShift.hour[j] = 'x';
    }
  }

  if (element.indexOf('wakes up') > 0) {
    continue;
  }
}

if (currentShift) {
  shifts.push(currentShift);
}

// Determine which guard has slept the most.
for (let i = 0; i < shifts.length; i++) {
  let napMinutes = 0;

  for ( let j = 0; j < 60; j++ ) {
    if ( shifts[i].hour[j] === 'x' ) { napMinutes += 1; }
  }

  if (guardNapMinutes[shifts[i].guardId]) {
    guardNapMinutes[shifts[i].guardId] += napMinutes;
  } else {
    guardNapMinutes[shifts[i].guardId] = napMinutes;
  }
}

for (let i = 0; i < Object.keys(guardNapMinutes).length; i++) {
  if (!sleepiestGuard) {
    sleepiestGuard = parseInt(Object.keys(guardNapMinutes)[i]);
    sleepyMinutes = parseInt(guardNapMinutes[sleepiestGuard.toString()]);
  } else {
    if (parseInt(guardNapMinutes[Object.keys(guardNapMinutes)[i]]) > sleepyMinutes) {
      sleepiestGuard = parseInt(Object.keys(guardNapMinutes)[i]);
      sleepyMinutes = parseInt(guardNapMinutes[sleepiestGuard.toString()]);
    }
  }
}

console.log(sleepiestGuard);

// Determine shifts for the sleepiest guard.
sleepiestShifts = shifts.map(shift => {
  if(shift.guardId === sleepiestGuard) {
    return shift.hour;
  }
}).filter(shift => !!shift);

// Determine the sleepiest minute.
for (let i = 0; i < 60; i ++) {
  let minuteTally = 0;
  for (let j = 0; j < sleepiestShifts.length; j++) {
    if (sleepiestShifts[j][i] === 'x') {
      minuteTally += 1;
    }
  }

  sleepiestShiftsCumulative.push(minuteTally);
}

sleepiestMinute = 0;

for (let i = 1; i < 60; i++) {
  if (sleepiestShiftsCumulative[i] > sleepiestShiftsCumulative[sleepiestMinute]) {
    sleepiestMinute = i;
  }
}

console.log(sleepiestMinute);

console.log(`answer to part one: ${sleepiestGuard * sleepiestMinute}`);

// Determine sleepiest minute per guard, and number of times per minute.
for (let i = 0; i < Object.keys(guardNapMinutes).length; i++) {
  const guardId = parseInt(Object.keys(guardNapMinutes)[i]);

  // Get the guard's shifts.
  const guardShifts = shifts.map(shift => {
    if(shift.guardId === guardId) {
      return shift.hour;
    }
  }).filter(shift => !!shift);


  const guardShiftsCumulative = [];
  // Get the sleep cumulative.
  for (let i = 0; i < 60; i ++) {
    let minuteTally = 0;
    for (let j = 0; j < guardShifts.length; j++) {
      if (guardShifts[j][i] === 'x') {
        minuteTally += 1;
      }
    }
  
    guardShiftsCumulative.push(minuteTally);
  }

  // Get the sleepiest minute.
  let sleepiestMinute = 0;

  for (let i = 1; i < 60; i++) {
    if (guardShiftsCumulative[i] > guardShiftsCumulative[sleepiestMinute]) {
      sleepiestMinute = i;
    }
  }
  
  const guardSleepiestMinute = {
    guardId: guardId,
    sleepiestMinute: sleepiestMinute,
    sleepsPerMinute: guardShiftsCumulative[sleepiestMinute]
  }

  sleepiestMinuteCumulative.push(guardSleepiestMinute); 
}

// Get the sleepiest minute for any guard.
let sleepiestMinuteAllGuardsId = sleepiestMinuteCumulative[0].guardId;
let sleepiestMinuteAllGuards = sleepiestMinuteCumulative[0].sleepiestMinute;
let sleepiestMinuteAllGuardsTimes = sleepiestMinuteCumulative[0].sleepsPerMinute;
for (let i = 1; i < sleepiestMinuteCumulative.length; i ++) {
  if (sleepiestMinuteCumulative[i].sleepsPerMinute > sleepiestMinuteAllGuardsTimes) {
    sleepiestMinuteAllGuardsId = sleepiestMinuteCumulative[i].guardId;
    sleepiestMinuteAllGuards = sleepiestMinuteCumulative[i].sleepiestMinute;
    sleepiestMinuteAllGuardsTimes = sleepiestMinuteCumulative[i].sleepsPerMinute;

  }
}

console.log(`Guard with the sleepiest minute: ${sleepiestMinuteAllGuardsId}`);
console.log(`Sleepiest minute for this guard: ${sleepiestMinuteAllGuards}`);
console.log(`Number of sleeps for this minute: ${sleepiestMinuteAllGuardsTimes}`);