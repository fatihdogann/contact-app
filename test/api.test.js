const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

let server, base, directory, ownerToken, otherToken, pendingToken, contactId;

before(async () => {
  directory = await fs.mkdtemp(path.join(os.tmpdir(), 'contact-app-test-'));
  process.env.DATA_DIR = directory;
  process.env.JWT_SECRET = randomUUID();
  const users = require('../src/db/usersStore');
  const { generateToken } = require('../src/middleware/auth');
  for (const role of ['owner', 'other', 'pending']) {
    const user = await users.create({ fullName: 'Test User', email: `${role}@example.invalid`,
      password: randomUUID(), phone: '05000000000' });
    if (role !== 'pending') await users.updateApprovalStatus(user.id, true);
    const token = generateToken(user);
    if (role === 'owner') ownerToken = token;
    if (role === 'other') otherToken = token;
    if (role === 'pending') pendingToken = token;
  }
  const app = require('../src/server');
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  if (directory) await fs.rm(directory, { recursive: true, force: true });
});

function request(route, token, method = 'GET', body) {
  return fetch(base + route, { method, headers: {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(body ? { 'Content-Type': 'application/json' } : {}),
  }, body: body ? JSON.stringify(body) : undefined });
}

test('health endpoint reports readiness', async () => {
  const response = await request('/health');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, 'ok');
});

test('contact API rejects anonymous and unapproved users', async () => {
  assert.equal((await request('/api/contacts')).status, 401);
  assert.equal((await request('/api/contacts', pendingToken)).status, 403);
});

test('owner can create and find a contact', async () => {
  const response = await request('/api/contacts', ownerToken, 'POST', {
    firstName: 'Deniz', lastName: 'Ornek', phone: '05000000000', category: 'Demo',
  });
  assert.equal(response.status, 201);
  contactId = (await response.json()).id;
  const matches = await (await request('/api/contacts/search?q=Deniz', ownerToken)).json();
  assert.deepEqual(matches.map(item => item.id), [contactId]);
});

test('another user cannot list, read, edit or delete the contact', async () => {
  assert.deepEqual(await (await request('/api/contacts', otherToken)).json(), []);
  for (const method of ['GET', 'PUT', 'DELETE']) {
    const response = await request(`/api/contacts/${contactId}`, otherToken, method,
      method === 'PUT' ? { firstName: 'Changed' } : undefined);
    assert.equal(response.status, 404);
  }
  assert.equal((await request(`/api/contacts/${contactId}`, ownerToken)).status, 200);
});

test('invalid contact input is rejected', async () => {
  const response = await request('/api/contacts', ownerToken, 'POST', {
    firstName: '123', lastName: 'Ornek', phone: 'invalid',
  });
  assert.equal(response.status, 400);
});

test('owner can update and delete their contact', async () => {
  const updated = await request(`/api/contacts/${contactId}`, ownerToken, 'PUT', { firstName: 'Ece' });
  assert.equal(updated.status, 200);
  assert.equal((await updated.json()).firstName, 'Ece');
  assert.equal((await request(`/api/contacts/${contactId}`, ownerToken, 'DELETE')).status, 204);
  assert.equal((await request(`/api/contacts/${contactId}`, ownerToken)).status, 404);
});
