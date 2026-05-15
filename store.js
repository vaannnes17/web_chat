import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFile = path.join(__dirname, 'db.json');

const readData = async () => {
    const data = await fs.readFile(dbFile, 'utf-8');
    return JSON.parse(data);
};

const saveChanges = async (data) => {
    await fs.writeFile(dbFile, JSON.stringify(data, null, 2));
};

export const getAll = async () => {
    return await readData();
};

export const create = async (newItemData) => {
    const data = await readData();
    const maxId = data.length > 0 ? Math.max(...data.map(item => item.id)) : 0;
    const newItem = { ...newItemData, id: maxId + 1 };
    data.push(newItem);
    await saveChanges(data);
    return newItem;
};

export const deleteById = async (id) => {
    const data = await readData();
    const filtered = data.filter(item => item.id !== parseInt(id));
    if (filtered.length !== data.length) {
        await saveChanges(filtered);
        return true;
    }
    return false;
};