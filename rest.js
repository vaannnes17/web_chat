import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as store from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());

let messageHistory = [];

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/chat', (req, res) => {
    res.render('chat', { messages: messageHistory });
});

app.get('/catalog', async (req, res) => {
    const employees = await store.getAll();
    res.render('catalog', { employees });
});

app.get('/items', async (req, res) => {
    const employees = await store.getAll();
    res.json(employees);
});

app.post('/items', async (req, res) => {
    const newEmployee = await store.create(req.body);
    res.status(201).json(newEmployee);
});

app.put('/items/:id', async (req, res) => {
    const updated = await store.updateById(req.params.id, req.body);
    updated ? res.json(updated) : res.status(404).json({ error: 'Not found' });
});

app.delete('/items/:id', async (req, res) => {
    const deleted = await store.deleteById(req.params.id);
    deleted ? res.sendStatus(204) : res.status(404).json({ error: 'Not found' });
});

export { app, messageHistory };