require('dotenv').config();
const express = require('express');
const fs = require('node:fs/promises')
const path = require('node:path');
const { generateRandomEvent } = require("./utils/zombieEvents");

const survivorsList = path.join(
    __dirname,
    './data/survivors.json'
);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Zombie survival backend is running' });
});

app.get('/survivors', async (req, res) => {
    try {
        const data = await fs.readFile(survivorsList, 'utf8');
        const survivors = JSON.parse(data);

        res.status(200).json(survivors);
    } catch (error) {
        console.log('Unable to find the list of survivors');
        res.status(500).json({ error: 'Unable to find the list of survivors' })
    }
});

app.get(`/survivors/:id`, async (req, res) => {
    try {
        const data = await fs.readFile(survivorsList, 'utf8')
        const survivor = JSON.parse(data).find(s => s.id === parseInt(req.params.id));

        if (!survivor) {
            res.status(404).json({ error: 'Survivor not found' });
            return;
        }

        res.status(200).json(survivor);
        return survivor;

    } catch (error) {
        console.log('Unable to find the survivor');
        res.status(500).json({ error: 'Unable to find the survivor' })
    }
});

app.post(`/survivors`, async (req, res) => {
    try {
        const { name, weapon, location } = req.body;

        if (!name || !weapon || !location) {
            return res.status(400).json({ error: 'name, weapon and location are required' });
        }

        const data = await fs.readFile(survivorsList, 'utf8')
        const survivors = JSON.parse(data);

        const id = survivors.length > 0 ? Math.max(...survivors.map(s => s.id)) + 1 : 1;
        const health = 100;
        const food = 50;
        const score = 0;
        const isAlive = true;

        const newSurvivor = { id, name, health, food, weapon, location, score, isAlive };

        survivors.push(newSurvivor);

        await fs.writeFile(survivorsList, JSON.stringify(survivors), 'utf8');

        res.status(201).json({ message: 'Survivor created successfully', newSurvivor } );
    } catch (error) {
        console.log('Unable to create the survivor');
        res.status(500).json({ error: 'Unable to create the survivor' })
    }
});

app.get(`/event/random`, async (req, res) => {
    try {
        const event = await generateRandomEvent();
        res.status(200).json(event);
    } catch (error) {
        console.log('Unable to generate a random event');
        res.status(500).json({ error: 'Unable to generate a random event' });
    }
});

app.post('/survivors/:id/scavenge', async (req, res) => {
    try {
        const data = await fs.readFile(survivorsList, 'utf8')

        const survivors = JSON.parse(data)
        const survivor = survivors.find(s => s.id === parseInt(req.params.id));

        if (!survivor) {
            res.status(404).json({ error: 'Survivor not found' });
            return;
        }

        const event = await generateRandomEvent();

        survivor.health += event.HealthChanged;
        survivor.food += event.foodChanged;
        survivor.score += event.scoreChanged;

        if (survivor.health <= 0) {
            survivor.isAlive = false;
        }

        await fs.writeFile(survivorsList, JSON.stringify(survivors), 'utf8');

        res.status(200).json({ message: 'Survivor scavenged successfully', event: `${event.event}`,  survivor });
    } catch (error) {
        console.log('Unable to scavenge the survivor');
        res.status(500).json({ error: 'Unable to scavenge the survivor' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
});


