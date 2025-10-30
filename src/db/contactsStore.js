const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const dataDir = path.join(__dirname, '..', '..', 'data');
const dataFile = path.join(dataDir, 'contacts.json');

async function ensureDataFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch (e) {
    await fs.writeFile(dataFile, '[]', 'utf-8');
  }
}

async function readAll() {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    // reset file if corrupted
    await fs.writeFile(dataFile, '[]', 'utf-8');
    return [];
  }
}

async function writeAll(items) {
  await fs.writeFile(dataFile, JSON.stringify(items, null, 2), 'utf-8');
}

function normalize(str) {
  return (str || '').toString().toLowerCase();
}

module.exports = {
  async getAll() {
    return await readAll();
  },

  async getAllByUserId(userId) {
    const items = await readAll();
    return items.filter(x => x.userId === userId);
  },

  async getById(id) {
    const items = await readAll();
    return items.find(x => x.id === id) || null;
  },

  async getByIdAndUserId(id, userId) {
    const items = await readAll();
    return items.find(x => x.id === id && x.userId === userId) || null;
  },

  async add({ firstName, lastName, phone, userId, category }) {
    const items = await readAll();
    const now = new Date().toISOString();
    const item = { 
      id: randomUUID(), 
      firstName, 
      lastName, 
      phone, 
      userId, 
      category: category || null,
      createdAt: now, 
      updatedAt: now 
    };
    items.push(item);
    await writeAll(items);
    return item;
  },

  async update(id, data, userId) {
    const items = await readAll();
    const idx = items.findIndex(x => x.id === id && x.userId === userId);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    const current = items[idx];
    const updated = {
      ...current,
      ...(data.firstName !== undefined ? { firstName: data.firstName } : {}),
      ...(data.lastName !== undefined ? { lastName: data.lastName } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.category !== undefined ? { category: data.category || null } : {}),
      updatedAt: now,
    };
    items[idx] = updated;
    await writeAll(items);
    return updated;
  },

  async remove(id, userId) {
    const items = await readAll();
    const filtered = items.filter(x => !(x.id === id && x.userId === userId));
    const changed = filtered.length !== items.length;
    if (changed) {
      await writeAll(filtered);
    }
    return changed;
  },

  async search(query, userId) {
    const items = await readAll();
    const userItems = items.filter(x => x.userId === userId);
    const q = normalize(query);
    if (!q) return userItems;
    return userItems.filter(it => {
      return (
        normalize(it.firstName).includes(q) ||
        normalize(it.lastName).includes(q) ||
        normalize(it.phone).includes(q)
      );
    });
  },

  async getCategories(userId) {
    const items = await readAll();
    const userItems = items.filter(x => x.userId === userId);
    const categories = new Set();
    userItems.forEach(item => {
      if (item.category) {
        categories.add(item.category);
      }
    });
    return Array.from(categories).sort();
  },

  async filterByCategory(category, userId) {
    const items = await readAll();
    return items.filter(x => x.userId === userId && x.category === category);
  }
};
