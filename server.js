const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const users = [
  { id: 1, username: 'admin', password: '123456', status: 'active' }
];

const servers = [
  { id: 1, name: 'سرور اصلی', host: 'localhost', port: 443, status: 'online' }
];

const subscriptions = [
  { id: 1, userId: 1, status: 'active', volumeGB: 50, days: 30 }
];

const configs = [
  { id: 1, name: 'VLESS-01', protocol: 'vless', status: 'active', userId: 1 }
];

const tokens = new Map();

function makeToken() {
  return crypto.randomBytes(24).toString('hex');
}

function getUserByToken(token) {
  return tokens.get(token) || null;
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = getUserByToken(token);
  if (!user) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  req.user = user;
  next();
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'MHA.NET API', time: new Date().toISOString() });
});

app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const exists = users.some(u => u.username === username);
  if (exists) {
    return res.status(409).json({ message: 'Username already exists.' });
  }

  const user = {
    id: Date.now(),
    username,
    password,
    status: 'active'
  };

  users.push(user);
  const token = makeToken();
  tokens.set(token, user);

  return res.status(201).json({
    message: 'Register successful.',
    token,
    user: { id: user.id, username: user.username, status: user.status }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const token = makeToken();
  tokens.set(token, user);

  return res.json({
    message: 'Login successful.',
    token,
    user: { id: user.id, username: user.username, status: user.status }
  });
});

app.post('/api/auth/logout', authRequired, (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (token) tokens.delete(token);
  return res.json({ message: 'Logged out successfully.' });
});

app.get('/api/me', authRequired, (req, res) => {
  const { user } = req;
  return res.json({
    id: user.id,
    username: user.username,
    status: user.status
  });
});

app.get('/api/users', authRequired, (req, res) => {
  return res.json(users.map(u => ({ id: u.id, username: u.username, status: u.status })));
});

app.post('/api/users', authRequired, (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  const exists = users.some(u => u.username === username);
  if (exists) {
    return res.status(409).json({ message: 'Username already exists.' });
  }
  const user = { id: Date.now(), username, password, status: 'active' };
  users.push(user);
  return res.status(201).json({ message: 'User created successfully.', user: { id: user.id, username: user.username, status: user.status } });
});

app.get('/api/servers', authRequired, (req, res) => {
  return res.json(servers);
});

app.post('/api/servers', authRequired, (req, res) => {
  const { name, host, port } = req.body || {};
  if (!name || !host || !port) {
    return res.status(400).json({ message: 'All server fields are required.' });
  }
  const server = { id: Date.now(), name, host, port, status: 'active' };
  servers.push(server);
  return res.status(201).json({ message: 'Server created successfully.', server });
});

app.get('/api/subscriptions', authRequired, (req, res) => {
  return res.json(subscriptions);
});

app.post('/api/subscriptions', authRequired, (req, res) => {
  const { userId, volumeGB, days } = req.body || {};
  if (!userId || !volumeGB || !days) {
    return res.status(400).json({ message: 'userId, volumeGB and days are required.' });
  }
  const sub = { id: Date.now(), userId, volumeGB, days, status: 'active' };
  subscriptions.push(sub);
  return res.status(201).json({ message: 'Subscription created successfully.', subscription: sub });
});

app.get('/api/configs', authRequired, (req, res) => {
  return res.json(configs);
});

app.post('/api/configs', authRequired, (req, res) => {
  const { name, userId, host, port, protocol } = req.body || {};
  if (!name || !userId || !host || !port || !protocol) {
    return res.status(400).json({ message: 'All config fields are required.' });
  }
  const config = { id: Date.now(), name, userId, host, port, protocol, status: 'active' };
  configs.push(config);
  return res.status(201).json({ message: 'Config created successfully.', config });
});

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found.' });
  }
  return res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`MHA.NET API running on http://localhost:${PORT}`);
});
