const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const JWT_SECRET = process.env.JWT_SECRET || 'mha-net-demo-secret';

const users = [
  { id: 1, username: 'admin', password: '123456', status: 'active' }
];

const servers = [
  { id: 1, name: 'main-server', host: 'server.example.com', port: 443 }
];

const subscriptions = [
  { id: 1, userId: '1', status: 'active', volumeGB: 50, days: 30 }
];

const configs = [
  { id: 1, name: 'VLESS-01', userId: '1', host: 'server.example.com', port: 443, protocol: 'vless', status: 'active' }
];

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'لطفاً ابتدا وارد حساب خود شوید.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'توکن نامعتبر است یا منقضی شده است.' });
  }
}

app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'mha-net-panel' });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'نام کاربری و رمز عبور لازم است.' });
  }

  const user = users.find(item => item.username === username && item.password === password);

  if (!user) {
    return res.status(401).json({ message: 'نام کاربری یا رمز عبور اشتباه است.' });
  }

  const safeUser = { id: user.id, username: user.username, status: user.status };
  const token = jwt.sign(safeUser, JWT_SECRET, { expiresIn: '7d' });

  return res.json({
    message: 'Login successful',
    token,
    user: safeUser
  });
});

app.post('/api/auth/logout', authRequired, (req, res) => {
  res.json({ message: 'Logged out' });
});

app.get('/api/me', authRequired, (req, res) => {
  const currentUser = users.find(item => item.id === req.user.id);
  if (!currentUser) {
    return res.status(404).json({ message: 'کاربر پیدا نشد.' });
  }

  return res.json({
    user: {
      id: currentUser.id,
      username: currentUser.username,
      status: currentUser.status
    }
  });
});

app.get('/api/users', authRequired, (req, res) => {
  res.json(users.map(({ password, ...user }) => user));
});

app.post('/api/users', authRequired, (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'تمامی فیلدها لازم هستند.' });
  }

  if (users.some(item => item.username === username)) {
    return res.status(409).json({ message: 'این نام کاربری قبلاً وجود دارد.' });
  }

  const newUser = {
    id: users.length + 1,
    username,
    password,
    status: 'active'
  };

  users.push(newUser);
  return res.status(201).json({
    message: 'کاربر ایجاد شد.',
    user: { id: newUser.id, username: newUser.username, status: newUser.status }
  });
});

app.get('/api/servers', authRequired, (req, res) => {
  res.json(servers);
});

app.post('/api/servers', authRequired, (req, res) => {
  const { name, host, port } = req.body || {};

  if (!name || !host || !port) {
    return res.status(400).json({ message: 'نام، آدرس و پورت سرور لازم است.' });
  }

  const newServer = { id: servers.length + 1, name, host, port };
  servers.push(newServer);
  return res.status(201).json({ message: 'سرور ثبت شد.', server: newServer });
});

app.get('/api/subscriptions', authRequired, (req, res) => {
  res.json(subscriptions);
});

app.post('/api/subscriptions', authRequired, (req, res) => {
  const { userId, volumeGB, days } = req.body || {};

  if (!userId || !volumeGB || !days) {
    return res.status(400).json({ message: 'شناسه کاربر، حجم و مدت اشتراک لازم است.' });
  }

  const newSub = {
    id: subscriptions.length + 1,
    userId,
    status: 'active',
    volumeGB: Number(volumeGB),
    days: Number(days)
  };

  subscriptions.push(newSub);
  return res.status(201).json({ message: 'اشتراک ایجاد شد.', subscription: newSub });
});

app.get('/api/configs', authRequired, (req, res) => {
  res.json(configs);
});

app.post('/api/configs', authRequired, (req, res) => {
  const { name, userId, host, port, protocol } = req.body || {};

  if (!name || !userId || !host || !port || !protocol) {
    return res.status(400).json({ message: 'تمامی فیلدهای کانفیگ لازم هستند.' });
  }

  const newConfig = {
    id: configs.length + 1,
    name,
    userId,
    host,
    port: Number(port),
    protocol,
    status: 'active'
  };

  configs.push(newConfig);
  return res.status(201).json({ message: 'کانفیگ ایجاد شد.', config: newConfig });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.use(express.static(ROOT, { index: false }));

app.listen(PORT, () => {
  console.log(`MHA.NET backend listening on http://localhost:${PORT}`);
});
