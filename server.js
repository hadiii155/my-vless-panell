const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const users = [
  { id: 1, username: 'admin', password: '123456', status: 'active' }
];

const servers = [
  { id: 1, name: 'سرور اصلی', host: 'server.example.com', port: 443 }
];

const configs = [
  { id: 1, name: 'VLESS-01', protocol: 'vless', status: 'active' }
];

const subscriptions = [
  { id: 1, userId: 1, status: 'active' }
];

const tokens = new Map();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

function makeToken() {
  return crypto.randomBytes(24).toString('hex');
}

function getUserFromToken(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;

  const username = tokens.get(token);
  if (!username) return null;

  return users.find((u) => u.username === username) || null;
}

function requireAuth(req, res, next) {
  const user = getUserFromToken(req);
  if (!user) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }
  req.user = user;
  next();
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, status: 'healthy', timestamp: new Date().toISOString() });
});

function registerUser(req, res) {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ ok: false, message: 'نام کاربری و رمز عبور لازم است.' });
  }

  const exists = users.some((u) => u.username === username);
  if (exists) {
    return res.status(409).json({ ok: false, message: 'این نام کاربری قبلاً ثبت شده است.' });
  }

  const user = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    username,
    password,
    status: 'active'
  };

  users.push(user);
  const token = makeToken();
  tokens.set(token, user.username);

  return res.status(201).json({
    ok: true,
    token,
    user: { id: user.id, username: user.username, status: user.status }
  });
}

function loginUser(req, res) {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ ok: false, message: 'نام کاربری یا رمز عبور اشتباه است.' });
  }

  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ ok: false, message: 'نام کاربری یا رمز عبور اشتباه است.' });
  }

  const token = makeToken();
  tokens.set(token, user.username);

  return res.status(200).json({
    ok: true,
    token,
    user: { id: user.id, username: user.username, status: user.status }
  });
}

app.post(['/api/auth/register', '/api/register'], registerUser);
app.post(['/api/auth/login', '/api/login'], loginUser);

app.post(['/api/auth/logout', '/api/logout'], (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (token && tokens.has(token)) {
    tokens.delete(token);
  }

  return res.status(200).json({ ok: true, message: 'خارج شدید.' });
});

app.get('/api/me', requireAuth, (req, res) => {
  const user = req.user;
  return res.status(200).json({
    ok: true,
    user: {
      id: user.id,
      username: user.username,
      status: user.status
    }
  });
});

app.get('/api/users', requireAuth, (req, res) => {
  return res.status(200).json(users.map((u) => ({ id: u.id, username: u.username, status: u.status })));
});

app.post('/api/users', requireAuth, (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ ok: false, message: 'نام کاربری و رمز عبور لازم است.' });
  }

  const exists = users.some((u) => u.username === username);
  if (exists) {
    return res.status(409).json({ ok: false, message: 'کاربر از قبل وجود دارد.' });
  }

  const user = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    username,
    password,
    status: 'active'
  };

  users.push(user);
  return res.status(201).json({ ok: true, message: 'کاربر ایجاد شد.', user: { id: user.id, username: user.username, status: user.status } });
});

app.get('/api/servers', requireAuth, (req, res) => {
  return res.status(200).json(servers);
});

app.post('/api/servers', requireAuth, (req, res) => {
  const { name, host, port } = req.body || {};
  if (!name || !host || !port) {
    return res.status(400).json({ ok: false, message: 'نام، آدرس و پورت سرور لازم است.' });
  }

  const server = {
    id: servers.length ? servers[servers.length - 1].id + 1 : 1,
    name,
    host,
    port: Number(port),
  };

  servers.push(server);
  return res.status(201).json({ ok: true, message: 'سرور ثبت شد.', server });
});

app.get('/api/subscriptions', requireAuth, (req, res) => {
  return res.status(200).json(subscriptions);
});

app.post('/api/subscriptions', requireAuth, (req, res) => {
  const { userId, volumeGB, days } = req.body || {};
  if (!userId || !volumeGB || !days) {
    return res.status(400).json({ ok: false, message: 'شناسه کاربر، حجم و مدت اشتراک لازم است.' });
  }

  const sub = {
    id: subscriptions.length ? subscriptions[subscriptions.length - 1].id + 1 : 1,
    userId: Number(userId),
    volumeGB: Number(volumeGB),
    days: Number(days),
    status: 'active'
  };

  subscriptions.push(sub);
  return res.status(201).json({ ok: true, message: 'اشتراک ایجاد شد.', subscription: sub });
});

app.get('/api/configs', requireAuth, (req, res) => {
  return res.status(200).json(configs);
});

app.post('/api/configs', requireAuth, (req, res) => {
  const { name, userId, host, port, protocol } = req.body || {};
  if (!name || !userId || !host || !port || !protocol) {
    return res.status(400).json({ ok: false, message: 'تمام فیلدهای کانفیگ لازم است.' });
  }

  const cfg = {
    id: configs.length ? configs[configs.length - 1].id + 1 : 1,
    name,
    userId,
    host,
    port: Number(port),
    protocol,
    status: 'active'
  };

  configs.push(cfg);
  return res.status(201).json({ ok: true, message: 'کانفیگ ایجاد شد.', config: cfg });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: `Route not found: ${req.method} ${req.path}` });
});

app.listen(PORT, () => {
  console.log(`MHA.NET backend running at http://localhost:${PORT}`);
});
