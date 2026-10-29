const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const users = [
  { id: 1, username: 'admin', status: 'active' }
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

  return res.json({
    message: 'Login successful',
    user: { id: 1, username, status: 'active' }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'تمامی فیلدها لازم هستند.' });
  }

  const newUser = {
    id: users.length + 1,
    username,
    status: 'active'
  };

  users.push(newUser);
  return res.status(201).json({ message: 'کاربر ایجاد شد.', user: newUser });
});

app.get('/api/servers', (req, res) => {
  res.json(servers);
});

app.post('/api/servers', (req, res) => {
  const { name, host, port } = req.body || {};

  if (!name || !host || !port) {
    return res.status(400).json({ message: 'نام، آدرس و پورت سرور لازم است.' });
  }

  const newServer = { id: servers.length + 1, name, host, port };
  servers.push(newServer);
  return res.status(201).json({ message: 'سرور ثبت شد.', server: newServer });
});

app.get('/api/subscriptions', (req, res) => {
  res.json(subscriptions);
});

app.post('/api/subscriptions', (req, res) => {
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

app.get('/api/configs', (req, res) => {
  res.json(configs);
});

app.post('/api/configs', (req, res) => {
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
