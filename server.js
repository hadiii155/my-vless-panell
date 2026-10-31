const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'mha-net-secret-key';
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function defaultDb() {
  const now = new Date().toISOString();
  return {
    users: [
      {
        id: 1,
        username: 'admin',
        passwordHash: bcrypt.hashSync('123456', 10),
        role: 'admin',
        status: 'active',
        createdAt: now,
        updatedAt: now
      }
    ],
    servers: [
      {
        id: 1,
        name: 'Germany Node 01',
        country: 'Germany',
        host: 'de.example.com',
        port: 443,
        capacity: 1000,
        status: 'online',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        name: 'Netherlands Node 02',
        country: 'Netherlands',
        host: 'nl.example.com',
        port: 443,
        capacity: 900,
        status: 'online',
        createdAt: now,
        updatedAt: now
      }
    ],
    configs: [
      {
        id: 1,
        name: 'Config-DE-01',
        protocol: 'vless',
        serverId: 1,
        userId: 1,
        uuid: uuidv4(),
        port: 443,
        transport: 'tcp',
        security: 'tls',
        status: 'active',
        createdAt: now,
        updatedAt: now
      }
    ],
    subscriptions: [
      {
        id: 1,
        userId: 1,
        planName: '30 GB',
        trafficLimit: 30,
        trafficUsed: 12,
        expiresAt: '2026-12-31T00:00:00.000Z',
        status: 'active',
        createdAt: now,
        updatedAt: now
      }
    ]
  };
}

function readDb() {
  ensureDataDir();

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb(), null, 2));
  }

  const raw = fs.readFileSync(DB_PATH, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      servers: Array.isArray(parsed.servers) ? parsed.servers : [],
      configs: Array.isArray(parsed.configs) ? parsed.configs : [],
      subscriptions: Array.isArray(parsed.subscriptions) ? parsed.subscriptions : []
    };
  } catch (error) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb(), null, 2));
    return readDb();
  }
}

function writeDb(data) {
  ensureDataDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    role: user.role || 'user',
    status: user.status || 'active',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function issueToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role || 'user'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ ok: false, message: 'Unauthorized: token missing' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const db = readDb();
    const user = db.users.find((item) => item.id === Number(payload.sub));

    if (!user) {
      return res.status(401).json({ ok: false, message: 'Unauthorized: user not found' });
    }

    req.user = sanitizeUser(user);
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: 'Unauthorized: invalid token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ ok: false, message: 'Forbidden: admin access required' });
  }
  next();
}

function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildVlessLink(config) {
  const host = config.host || 'example.com';
  const port = config.port || 443;
  const uuid = config.uuid || uuidv4();
  const name = encodeURIComponent(config.name || 'VLESS-Config');
  const query = new URLSearchParams({
    type: config.transport || 'tcp',
    security: config.security || 'tls',
    flow: 'xtls-rprx-vision',
    sni: host
  }).toString();

  return `vless://${uuid}@${host}:${port}?${query}#${name}`;
}

app.get('/api/health', (req, res) => {
  return res.status(200).json({
    ok: true,
    message: 'MHA.NET backend is healthy',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ ok: false, message: 'Username and password are required' });
  }

  const db = readDb();
  const user = db.users.find((item) => item.username === username);

  if (!user) {
    return res.status(401).json({ ok: false, message: 'Invalid username or password' });
  }

  const isValid = bcrypt.compareSync(password, user.passwordHash);

  if (!isValid) {
    return res.status(401).json({ ok: false, message: 'Invalid username or password' });
  }

  const authUser = sanitizeUser(user);
  const token = issueToken(user);

  return res.status(200).json({
    ok: true,
    token,
    user: authUser
  });
});

app.post('/api/auth/register', (req, res) => {
  const { username, password, role = 'user' } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ ok: false, message: 'Username and password are required' });
  }

  const db = readDb();
  const exists = db.users.some((item) => item.username === username);

  if (exists) {
    return res.status(409).json({ ok: false, message: 'Username already exists' });
  }

  const now = new Date().toISOString();
  const newUser = {
    id: db.users.length ? Math.max(...db.users.map((item) => item.id)) + 1 : 1,
    username,
    passwordHash: bcrypt.hashSync(password, 10),
    role: ['admin', 'user'].includes(role) ? role : 'user',
    status: 'active',
    createdAt: now,
    updatedAt: now
  };

  db.users.push(newUser);
  writeDb(db);

  return res.status(201).json({
    ok: true,
    user: sanitizeUser(newUser),
    token: issueToken(newUser)
  });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  return res.status(200).json({ ok: true, user: req.user });
});

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  return res.status(200).json({ ok: true, message: 'Logged out successfully' });
});

app.get('/api/dashboard', authMiddleware, requireAdmin, (req, res) => {
  const db = readDb();

  const totalUsers = db.users.length;
  const activeUsers = db.users.filter((user) => user.status === 'active').length;
  const totalConfigs = db.configs.length;
  const activeConfigs = db.configs.filter((config) => config.status === 'active').length;
  const totalServers = db.servers.length;
  const onlineServers = db.servers.filter((server) => server.status === 'online').length;

  const totalTraffic = db.subscriptions.reduce((sum, item) => sum + safeNumber(item.trafficLimit, 0), 0);
  const usedTraffic = db.subscriptions.reduce((sum, item) => sum + safeNumber(item.trafficUsed, 0), 0);

  return res.status(200).json({
    ok: true,
    stats: {
      totalUsers,
      activeUsers,
      totalConfigs,
      activeConfigs,
      totalServers,
      onlineServers,
      totalTraffic,
      usedTraffic
    }
  });
});

app.get('/api/users', authMiddleware, requireAdmin, (req, res) => {
  const db = readDb();
  return res.status(200).json({
    ok: true,
    users: db.users.map(sanitizeUser)
  });
});

app.post('/api/users', authMiddleware, requireAdmin, (req, res) => {
  const { username, password, role = 'user', status = 'active' } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ ok: false, message: 'Username and password are required' });
  }

  const db = readDb();
  const exists = db.users.some((item) => item.username === username);

  if (exists) {
    return res.status(409).json({ ok: false, message: 'Username already exists' });
  }

  const now = new Date().toISOString();
  const newUser = {
    id: db.users.length ? Math.max(...db.users.map((item) => item.id)) + 1 : 1,
    username,
    passwordHash: bcrypt.hashSync(password, 10),
    role: ['admin', 'user'].includes(role) ? role : 'user',
    status: ['active', 'inactive', 'banned'].includes(status) ? status : 'active',
    createdAt: now,
    updatedAt: now
  };

  db.users.push(newUser);
  writeDb(db);

  return res.status(201).json({
    ok: true,
    user: sanitizeUser(newUser)
  });
});

app.put('/api/users/:id', authMiddleware, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { username, role, status } = req.body || {};
  const db = readDb();

  const index = db.users.findIndex((user) => user.id === Number(id));
  if (index === -1) {
    return res.status(404).json({ ok: false, message: 'User not found' });
  }

  db.users[index] = {
    ...db.users[index],
    username: username || db.users[index].username,
    role: ['admin', 'user'].includes(role) ? role : db.users[index].role,
    status: ['active', 'inactive', 'banned'].includes(status) ? status : db.users[index].status,
    updatedAt: new Date().toISOString()
  };

  writeDb(db);
  return res.status(200).json({ ok: true, user: sanitizeUser(db.users[index]) });
});

app.delete('/api/users/:id', authMiddleware, requireAdmin, (req, res) => {
  const db = readDb();
  const targetId = Number(req.params.id);
  const index = db.users.findIndex((user) => user.id === targetId);

  if (index === -1) {
    return res.status(404).json({ ok: false, message: 'User not found' });
  }

  db.users.splice(index, 1);
  writeDb(db);

  return res.status(200).json({ ok: true, message: 'User deleted successfully' });
});

app.get('/api/servers', authMiddleware, requireAdmin, (req, res) => {
  const db = readDb();
  return res.status(200).json({ ok: true, servers: db.servers });
});

app.post('/api/servers', authMiddleware, requireAdmin, (req, res) => {
  const { name, country, host, port, capacity, status = 'online' } = req.body || {};

  if (!name || !host || !port) {
    return res.status(400).json({ ok: false, message: 'Name, host and port are required' });
  }

  const db = readDb();
  const now = new Date().toISOString();
  const newServer = {
    id: db.servers.length ? Math.max(...db.servers.map((item) => item.id)) + 1 : 1,
    name,
    country: country || 'Unknown',
    host,
    port: Number(port),
    capacity: safeNumber(capacity, 0),
    status: ['online', 'offline'].includes(status) ? status : 'online',
    createdAt: now,
    updatedAt: now
  };

  db.servers.push(newServer);
  writeDb(db);

  return res.status(201).json({ ok: true, server: newServer });
});

app.put('/api/servers/:id', authMiddleware, requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.servers.findIndex((server) => server.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ ok: false, message: 'Server not found' });
  }

  db.servers[index] = {
    ...db.servers[index],
    ...req.body,
    port: safeNumber(req.body.port, db.servers[index].port),
    capacity: safeNumber(req.body.capacity, db.servers[index].capacity),
    updatedAt: new Date().toISOString()
  };

  writeDb(db);
  return res.status(200).json({ ok: true, server: db.servers[index] });
});

app.delete('/api/servers/:id', authMiddleware, requireAdmin, (req, res) => {
  const db = readDb();
  const targetId = Number(req.params.id);
  const index = db.servers.findIndex((server) => server.id === targetId);

  if (index === -1) {
    return res.status(404).json({ ok: false, message: 'Server not found' });
  }

  db.servers.splice(index, 1);
  writeDb(db);

  return res.status(200).json({ ok: true, message: 'Server deleted successfully' });
});

app.get('/api/configs', authMiddleware, requireAdmin, (req, res) => {
  const db = readDb();
  return res.status(200).json({ ok: true, configs: db.configs });
});

app.post('/api/configs', authMiddleware, requireAdmin, (req, res) => {
  const {
    name,
    userId,
    serverId,
    protocol = 'vless',
    transport = 'tcp',
    security = 'tls',
    port = 443
  } = req.body || {};

  if (!name || !serverId) {
    return res.status(400).json({ ok: false, message: 'Config name and serverId are required' });
  }

  const db = readDb();
  const now = new Date().toISOString();
  const server = db.servers.find((item) => item.id === Number(serverId));

  if (!server) {
    return res.status(404).json({ ok: false, message: 'Server does not exist' });
  }

  const newConfig = {
    id: db.configs.length ? Math.max(...db.configs.map((item) => item.id)) + 1 : 1,
    name,
    protocol,
    serverId: Number(serverId),
    userId: userId ? Number(userId) : null,
    uuid: uuidv4(),
    host: server.host,
    port: Number(port),
    transport,
    security,
    status: 'active',
    link: '',
    createdAt: now,
    updatedAt: now
  };

  newConfig.link = buildVlessLink(newConfig);
  db.configs.push(newConfig);
  writeDb(db);

  return res.status(201).json({ ok: true, config: newConfig });
});

app.put('/api/configs/:id', authMiddleware, requireAdmin, (req, res) => {
  const db = readDb();
  const targetId = Number(req.params.id);
  const index = db.configs.findIndex((config) => config.id === targetId);

  if (index === -1) {
    return res.status(404).json({ ok: false, message: 'Config not found' });
  }

  const server = db.servers.find((item) => item.id === Number(req.body.serverId || db.configs[index].serverId));

  if (!server) {
    return res.status(404).json({ ok: false, message: 'Server does not exist' });
  }

  db.configs[index] = {
    ...db.configs[index],
    ...req.body,
    serverId: Number(req.body.serverId || db.configs[index].serverId),
    port: Number(req.body.port || db.configs[index].port),
    host: server.host,
    updatedAt: new Date().toISOString()
  };

  db.configs[index].link = buildVlessLink(db.configs[index]);
  writeDb(db);

  return res.status(200).json({ ok: true, config: db.configs[index] });
});

app.delete('/api/configs/:id', authMiddleware, requireAdmin, (req, res) => {
  const db = readDb();
  const targetId = Number(req.params.id);
  const index = db.configs.findIndex((config) => config.id === targetId);

  if (index === -1) {
    return res.status(404).json({ ok: false, message: 'Config not found' });
  }

  db.configs.splice(index, 1);
  writeDb(db);

  return res.status(200).json({ ok: true, message: 'Config deleted successfully' });
});

app.get('/api/subscriptions', authMiddleware, requireAdmin, (req, res) => {
  const db = readDb();
  return res.status(200).json({ ok: true, subscriptions: db.subscriptions });
});

app.post('/api/subscriptions', authMiddleware, requireAdmin, (req, res) => {
  const { userId, planName, trafficLimit, trafficUsed = 0, expiresAt, status = 'active' } = req.body || {};

  if (!userId || !planName || !trafficLimit || !expiresAt) {
    return res.status(400).json({ ok: false, message: 'userId, planName, trafficLimit and expiresAt are required' });
  }

  const db = readDb();
  const now = new Date().toISOString();
  const newSubscription = {
    id: db.subscriptions.length ? Math.max(...db.subscriptions.map((item) => item.id)) + 1 : 1,
    userId: Number(userId),
    planName,
    trafficLimit: safeNumber(trafficLimit, 0),
    trafficUsed: safeNumber(trafficUsed, 0),
    expiresAt,
    status: ['active', 'expired', 'paused'].includes(status) ? status : 'active',
    createdAt: now,
    updatedAt: now
  };

  db.subscriptions.push(newSubscription);
  writeDb(db);

  return res.status(201).json({ ok: true, subscription: newSubscription });
});

app.put('/api/subscriptions/:id', authMiddleware, requireAdmin, (req, res) => {
  const db = readDb();
  const targetId = Number(req.params.id);
  const index = db.subscriptions.findIndex((sub) => sub.id === targetId);

  if (index === -1) {
    return res.status(404).json({ ok: false, message: 'Subscription not found' });
  }

  db.subscriptions[index] = {
    ...db.subscriptions[index],
    ...req.body,
    userId: Number(req.body.userId || db.subscriptions[index].userId),
    trafficLimit: safeNumber(req.body.trafficLimit, db.subscriptions[index].trafficLimit),
    trafficUsed: safeNumber(req.body.trafficUsed, db.subscriptions[index].trafficUsed),
    updatedAt: new Date().toISOString()
  };

  writeDb(db);
  return res.status(200).json({ ok: true, subscription: db.subscriptions[index] });
});

app.delete('/api/subscriptions/:id', authMiddleware, requireAdmin, (req, res) => {
  const db = readDb();
  const targetId = Number(req.params.id);
  const index = db.subscriptions.findIndex((sub) => sub.id === targetId);

  if (index === -1) {
    return res.status(404).json({ ok: false, message: 'Subscription not found' });
  }

  db.subscriptions.splice(index, 1);
  writeDb(db);

  return res.status(200).json({ ok: true, message: 'Subscription deleted successfully' });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: `Route not found: ${req.method} ${req.path}` });
});

app.listen(PORT, () => {
  console.log(`MHA.NET backend running on http://localhost:${PORT}`);
});
