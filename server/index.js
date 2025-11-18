import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize data file if it doesn't exist
async function initializeDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify({ designers: [] }, null, 2));
    }
}

// Read data from file
async function readData() {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
}

// Write data to file
async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Routes

// Get all designers
app.get('/api/designers', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.designers);
    } catch (error) {
        console.error('Error reading designers:', error);
        res.status(500).json({ error: 'Failed to read designers' });
    }
});

// Add a designer
app.post('/api/designers', async (req, res) => {
    try {
        const data = await readData();
        const newDesigner = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        data.designers.push(newDesigner);
        await writeData(data);
        res.status(201).json(newDesigner);
    } catch (error) {
        console.error('Error adding designer:', error);
        res.status(500).json({ error: 'Failed to add designer' });
    }
});

// Delete a designer
app.delete('/api/designers/:id', async (req, res) => {
    try {
        const data = await readData();
        const filteredDesigners = data.designers.filter(d => d.id !== req.params.id);

        if (filteredDesigners.length === data.designers.length) {
            return res.status(404).json({ error: 'Designer not found' });
        }

        data.designers = filteredDesigners;
        await writeData(data);
        res.json({ message: 'Designer deleted successfully' });
    } catch (error) {
        console.error('Error deleting designer:', error);
        res.status(500).json({ error: 'Failed to delete designer' });
    }
});

// Initialize and start server
initializeDataFile().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Backend server running on http://localhost:${PORT}`);
        console.log(`📁 Data stored in: ${DATA_FILE}`);
    });
}).catch(err => {
    console.error('Failed to initialize server:', err);
    process.exit(1);
});
