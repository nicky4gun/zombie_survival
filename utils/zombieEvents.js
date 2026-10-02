const fs = rrequire('node:fs/promises');
const path = require('path');

const events = path.join(
    __dirname,
    './data/zombieEvents.json'
);

async function generateRandomEvent() {
    const data = await fs.readFile(events, 'utf8')
    const events = JSON.parse(data);

    const randomIndex = Math.floor(Math.random() * events.length);
    return events[randomIndex];
}

module.exports = { generateRandomEvent };