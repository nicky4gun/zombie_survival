require('dotenv').config();
const express = require('express');
const fs = require('node:fs/promises')
const path = require('node:path');
const {parse} = require("dotenv");

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
})

app.post(`/survivors`, async (req, res) => {
    const newSurvivor = req.body;
    try {
        const survivor = await fs.appendFile(survivorsList, newSurvivor,  'utf8');
        res.status(201).json({ message: 'Survivor created successfully' });
    } catch (error) {
        console.log('Unable to create the survivor');
        res.status(500).json({ error: 'Unable to create the survivor' })
    }
})

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
});


