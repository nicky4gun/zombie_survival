const readLine = require('readline/promises');

const rs = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

const PORT = process.env.PORT || 3000;

async function addSurvivor() {
    try {
        const name = await rs.question('What is the survivor name?: ');
        const weapon = await rs.question('What weapon does the survivor have?: ');
        const location = await rs.question('What is the survivor location?: ');

        const response = await fetch(`http://localhost:${PORT}/survivors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, weapon, location })
        });

        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.error('Failed to add survivor: ', error.message);
    } finally {
        rs.close();
    }
}

addSurvivor();