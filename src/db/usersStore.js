const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, '..', '..', 'data');
const dataFile = path.join(dataDir, 'users.json');

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
    await fs.writeFile(dataFile, '[]', 'utf-8');
    return [];
  }
}

async function writeAll(users) {
  await fs.writeFile(dataFile, JSON.stringify(users, null, 2), 'utf-8');
}

module.exports = {
  async getAll() {
    return await readAll();
  },

  async getById(id) {
    const users = await readAll();
    return users.find(u => u.id === id) || null;
  },

  async getByEmail(email) {
    const users = await readAll();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async create({ fullName, phone, email, password, age, province, district, gender }) {
    const users = await readAll();
    
    // Default storage limit: 100 MB
    const storageLimit = 100 * 1024 * 1024; // 100 MB in bytes
    
    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Bu e-posta adresi zaten kayıtlı');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    
    const user = {
      id: randomUUID(),
      fullName,
      phone,
      email: email.toLowerCase(),
      password: hashedPassword,
      age,
      province,
      district,
      gender: gender || null,
      role: 'user',
      approved: false,
      storageLimit: storageLimit,
      storageUsed: 0,
      createdAt: now,
      updatedAt: now
    };

    users.push(user);
    await writeAll(users);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async updateApprovalStatus(id, approved) {
    const users = await readAll();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;

    users[idx].approved = approved;
    users[idx].updatedAt = new Date().toISOString();
    
    await writeAll(users);
    
    const { password, ...userWithoutPassword } = users[idx];
    return userWithoutPassword;
  },

  async setRole(id, role) {
    const users = await readAll();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;

    users[idx].role = role;
    users[idx].updatedAt = new Date().toISOString();
    
    await writeAll(users);
    
    const { password, ...userWithoutPassword } = users[idx];
    return userWithoutPassword;
  },

  async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password);
  },

  async getPendingUsers() {
    const users = await readAll();
    return users
      .filter(u => !u.approved)
      .map(({ password, ...user }) => user);
  },

  async getAllUsersWithoutPassword() {
    const users = await readAll();
    return users.map(({ password, ...user }) => user);
  },

  async updateStorageUsed(userId, storageUsed) {
    const users = await readAll();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('Kullanıcı bulunamadı');
    
    user.storageUsed = storageUsed;
    user.updatedAt = new Date().toISOString();
    await writeAll(users);
    return user;
  },

  async checkStorageLimit(userId, additionalSize = 0) {
    const user = await this.getById(userId);
    if (!user) throw new Error('Kullanıcı bulunamadı');
    
    const storageLimit = user.storageLimit || 100 * 1024 * 1024; // 100 MB default
    const storageUsed = user.storageUsed || 0;
    
    if (storageUsed + additionalSize > storageLimit) {
      return {
        allowed: false,
        message: 'Depolama limitiniz doldu. Lütfen bazı kişileri silin.',
        used: storageUsed,
        limit: storageLimit,
        remaining: storageLimit - storageUsed
      };
    }
    
    return {
      allowed: true,
      used: storageUsed,
      limit: storageLimit,
      remaining: storageLimit - storageUsed
    };
  }
};
