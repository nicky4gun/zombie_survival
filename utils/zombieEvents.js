const fs = require('node:fs/promises');
const path = require('path');

const zombieEvents = path.join(
    __dirname,
    '../data/zombieEvents.json'
);

async function generateRandomEvent() {
    const data = await fs.readFile(zombieEvents, 'utf8')
    const events = JSON.parse(data);

    const randomIndex = Math.floor(Math.random() * events.length);
    return events[randomIndex];
}

module.exports = { generateRandomEvent };