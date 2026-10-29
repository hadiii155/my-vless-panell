<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#140d20">
<title>MHA.NET | VPN Manager</title>
<style>
:root{--bg:#100b19;--bg2:#180f26;--panel:#1d142b;--panel-2:#20172f;--border:#3c2b4b;--orange:#ff702b;--red:#ef345e;--purple:#823cff;--purple-2:#9d6af8;--text:#f7f1ff;--muted:#b9a9c9;--green:#1fbf8f;--gray:#3b3347;--shadow:0 18px 40px rgba(0,0,0,.35)}
*{box-sizing:border-box}html,body{height:100%}body{margin:0;background:radial-gradient(circle at top, rgba(130,60,255,.18), transparent 30%), linear-gradient(135deg,var(--bg),var(--bg2));color:var(--text);font-family:Tahoma,Segoe UI,sans-serif}a{text-decoration:none;color:inherit}.shell{display:flex;max-width:1400px;margin:0 auto;padding:20px;gap:18px}.shell nav{width:250px;background:rgba(24,15,38,.8);border:1px solid var(--border);border-radius:20px;padding:16px;display:flex;flex-direction:column;gap:10px;backdrop-filter:blur(10px);box-shadow:var(--shadow)}.shell nav button{border:none;background:transparent;color:var(--text);padding:12px 16px;border-radius:12px;font-size:15px;text-align:right;cursor:pointer;transition:.2s ease}.shell nav button:hover,.shell nav button.active{background:linear-gradient(135deg,rgba(130,60,255,.26),rgba(255,112,43,.17));border:1px solid rgba(130,60,255,.5)}main{flex:1;padding:10px 0}main .page{display:none;animation:fade .2s ease}.page.active{display:block}.panel,.card{background:rgba(29,20,43,.92);border:1px solid var(--border);border-radius:18px;padding:20px;box-shadow:var(--shadow)}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:18px;margin-top:16px}.card{display:flex;flex-direction:column;gap:12px;background:linear-gradient(180deg,rgba(29,20,43,.95),rgba(19,14,28,.95));min-height:130px}.metric{font-size:2rem;font-weight:700;color:var(--purple-2)}button{cursor:pointer}.logout-btn{display:none}header{display:flex;align-items:center;justify-content:space-between;padding:18px 26px;background:rgba(18,12,26,.6);border-bottom:1px solid rgba(255,255,255,.08);backdrop-filter:blur(8px);position:sticky;top:0;z-index:5}.logo{display:flex;align-items:center;gap:10px;font-size:1.5rem;font-weight:800;letter-spacing:.08em}.logo small{font-size:.7rem;color:var(--muted);letter-spacing:.2em}.menu{display:none}.actions,form,.form{display:flex;flex-wrap:wrap;gap:12px}.actions button{padding:11px 18px;border-radius:12px;border:1px solid transparent;background:linear-gradient(135deg,var(--purple),var(--purple-2));color:var(--text);font-weight:700}.gray{background:#2d2737!important;border-color:var(--border)!important;color:var(--text)!important}.green{background:linear-gradient(135deg,#0d9f74,#1fbf8f)!important}.red{background:linear-gradient(135deg,#a32558,#ef345e)!important}.warning{margin-top:14px;padding:12px 14px;border-radius:12px;border:1px solid rgba(255,112,43,.4);background:rgba(255,112,43,.1);color:#f8d7b0}.muted{color:var(--muted)}input{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--border);background:rgba(255,255,255,.03);color:var(--text);outline:none}.auth-shell{display:flex;justify-content:center;align-items:center;min-height:76vh;padding:20px 0}.auth-header{display:flex;justify-content:center;margin-bottom:18px}.tab-toggle{display:inline-flex;background:rgba(255,255,255,.04);padding:5px;border:1px solid var(--border);border-radius:999px}.tab-toggle button{border:none;background:transparent;padding:10px 22px;border-radius:999px;color:var(--muted);font-weight:700}.tab-toggle button.active{background:linear-gradient(135deg,var(--purple),var(--purple-2));color:var(--text)}.auth-card{max-width:420px;width:100%}.mini{font-size:.82rem;color:var(--muted)}.tablewrap{overflow:auto}.tablewrap table{width:100%;border-collapse:collapse}.tablewrap th,.tablewrap td{padding:12px 10px;text-align:right;border-bottom:1px solid var(--border)}.tablewrap th{color:var(--muted);font-weight:600}#toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);padding:12px 18px;background:rgba(19,14,28,.95);border:1px solid var(--border);border-radius:999px;display:none;box-shadow:var(--shadow);z-index:20}footer{padding:20px;text-align:center;color:var(--muted)}@media (max-width:900px){.shell{flex-direction:column}.shell nav{width:100%;display:none}.shell nav.open{display:flex}.menu{display:block;background:transparent;border:1px solid var(--border);color:var(--text);padding:8px 12px;border-radius:10px}header{padding:14px 18px}main{padding-top:0}}@keyframes fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
</style>
</head>
<body>

<header>
<button class="menu" onclick="toggleMenu()" aria-label="منو">☰</button>
<div class="logo">🦁 MHA.NET<small>VPN MANAGEMENT PANEL</small></div>
<button class="gray logout-btn" onclick="logout()">خروج</button>
</header>

<div class="shell">
<nav id="nav">
<button class="active" onclick="page('dashboard',this)">🏠 داشبورد</button>
<button onclick="page('configs',this)">🔗 کانفیگ‌ها</button>
<button onclick="page('users',this)">👥 کاربران</button>
<button onclick="page('servers',this)">🌐 سرورها</button>
<button onclick="page('subs',this)">📦 اشتراک‌ها</button>
<button onclick="page('security',this)">🛡️ امنیت</button>
<button onclick="page('settings',this)">⚙️ تنظیمات</button>
<button onclick="page('account',this)">👤 حساب کاربری</button>
</nav>

<main>
<section id="auth" class="page">
<div class="logo">🦁 MHA.NET</div>
<div class="panel auth-card">
<div class="auth-shell">
<div class="auth-header">
<div class="tab-toggle">
<button id="loginTabBtn" class="active" onclick="switchAuthMode('login')">ورود</button>
<button id="registerTabBtn" onclick="switchAuthMode('register')">ثبت‌نام</button>
</div>
</div>

<div id="loginForm">
<h2 id="authTitle">ورود به پنل</h2>
<p class="muted">به پنل مدیریت MHA.NET خوش آمدی.</p>
<label>نام کاربری</label>
<input id="loginUser" autocomplete="username" placeholder="نام کاربری">
<label>رمز عبور</label>
<input id="loginPass" type="password" autocomplete="current-password" placeholder="رمز عبور">
<div class="actions">
<button onclick="login()">ورود</button>
</div>
<p class="mini">نام کاربری پیش‌فرض: admin | رمز عبور: 123456</p>
</div>

<div id="registerForm" style="display:none;">
<h2>ثبت‌نام در پنل</h2>
<p class="muted">حساب جدید بساز و به داشبورد دسترسی پیدا کن.</p>
<label>نام کاربری</label>
<input id="regUser" autocomplete="username" placeholder="نام کاربری جدید">
<label>رمز عبور</label>
<input id="regPass" type="password" autocomplete="new-password" placeholder="رمز عبور جدید">
<div class="actions">
<button onclick="register()">ثبت‌نام</button>
</div>
</div>
</div>
</div>
</section>

<section id="dashboard" class="page active">
<h2>داشبورد مدیریت</h2>
<p class="muted">مدیریت سرویس‌های MHA.NET</p>
<div class="grid">
<div class="card">👥 کاربران<div class="metric" id="usersCount">—</div></div>
<div class="card">🔗 کانفیگ‌ها<div class="metric" id="configsCount">—</div></div>
<div class="card">🌐 سرورها<div class="metric" id="serversCount">—</div></div>
<div class="card">📦 اشتراک‌ها<div class="metric" id="subsCount">—</div></div>
</div>
<div class="panel">
<h3>وضعیت اتصال</h3>
<p id="connectionStatus" class="muted">API هنوز تنظیم نشده است.</p>
<div class="warning">اگر بک‌اند وجود ندارد، پنل به‌صورت localStorage به‌صورت خودکار کار می‌کند. اگر API واقعی داشته باشی، آدرس آن را در تنظیمات وارد کن.</div>
</div>
<div class="panel">
<h3>پشتیبانی MHA.NET</h3>
<button class="green" onclick="support()">✈️ پشتیبانی تلگرام</button>
</div>
</section>

<section id="configs" class="page">
<h2>کانفیگ‌های VLESS</h2>
<div class="panel">
<div class="form">
<div><label>نام کانفیگ</label><input id="cName" placeholder="مثلاً VLESS-01"></div>
<div><label>شناسه کاربر</label><input id="cUser" placeholder="شناسه کاربر"></div>
<div><label>آدرس سرور</label><input id="cHost" placeholder="server.example.com"></div>
<div><label>پورت</label><input id="cPort" type="number" placeholder="443"></div>
</div>
<div class="actions"><button onclick="apiAction('POST','/api/configs',{name:val('cName'),userId:val('cUser'),host:val('cHost'),port:Number(val('cPort')),protocol:'vless'})">ایجاد کانفیگ</button><button class="gray" onclick="loadResource('configs')">بارگذاری مجدد</button></div>
</div>
<div class="panel tablewrap"><table><thead><tr><th>نام</th><th>پروتکل</th><th>وضعیت</th></tr></thead><tbody id="configRows"><tr><td colspan="3">API متصل نشده است.</td></tr></tbody></table></div>
</section>

<section id="users" class="page">
<h2>مدیریت کاربران</h2>
<div class="panel">
<div class="form">
<div><label>نام کاربری</label><input id="uName" placeholder="username"></div>
<div><label>رمز عبور موقت</label><input id="uPass" type="password" placeholder="رمز امن"></div>
</div>
<div class="actions"><button onclick="apiAction('POST','/api/users',{username:val('uName'),password:val('uPass')})">ایجاد کاربر</button><button class="gray" onclick="loadResource('users')">بارگذاری مجدد</button></div>
</div>
<div class="panel tablewrap"><table><thead><tr><th>شناسه</th><th>نام کاربری</th><th>وضعیت</th></tr></thead><tbody id="userRows"><tr><td colspan="3">API متصل نشده است.</td></tr></tbody></table></div>
</section>

<section id="servers" class="page">
<h2>مدیریت سرورها</h2>
<div class="panel">
<div class="form">
<div><label>نام سرور</label><input id="sName" placeholder="سرور اصلی"></div>
<div><label>آدرس سرور</label><input id="sHost" placeholder="IP یا دامنه"></div>
<div><label>پورت اتصال</label><input id="sPort" type="number" placeholder="443"></div>
</div>
<div class="actions"><button onclick="apiAction('POST','/api/servers',{name:val('sName'),host:val('sHost'),port:Number(val('sPort'))})">ثبت سرور</button><button class="gray" onclick="loadResource('servers')">بارگذاری مجدد</button></div>
</div>
<div class="panel tablewrap"><table><thead><tr><th>نام</th><th>آدرس</th><th>پورت</th></tr></thead><tbody id="serverRows"><tr><td colspan="3">API متصل نشده است.</td></tr></tbody></table></div>
</section>

<section id="subs" class="page">
<h2>مدیریت اشتراک‌ها</h2>
<div class="panel">
<div class="form">
<div><label>شناسه کاربر</label><input id="subUser" placeholder="شناسه کاربر"></div>
<div><label>حجم (GB)</label><input id="subVolume" type="number" min="1" placeholder="50"></div>
<div><label>مدت (روز)</label><input id="subDays" type="number" min="1" placeholder="30"></div>
</div>
<div class="actions"><button onclick="apiAction('POST','/api/subscriptions',{userId:val('subUser'),volumeGB:Number(val('subVolume')),days:Number(val('subDays'))})">ایجاد اشتراک</button><button class="gray" onclick="loadResource('subscriptions')">بارگذاری مجدد</button></div>
</div>
<div class="panel tablewrap"><table><thead><tr><th>شناسه</th><th>کاربر</th><th>وضعیت</th></tr></thead><tbody id="subRows"><tr><td colspan="3">API متصل نشده است.</td></tr></tbody></table></div>
</section>

<section id="security" class="page">
<h2>امنیت</h2>
<div class="panel">
<p>🔐 احراز هویت سمت بک‌اند انجام می‌شود.</p>
<p class="muted">کلید API، رمز عبور مدیر و اطلاعات حساس سرور را در HTML قرار نده.</p>
<p class="muted">در نسخه نهایی باید سطح دسترسی مدیر و کاربر، اعتبارسنجی ورودی و ثبت رخدادها در سمت سرور پیاده‌سازی شود.</p>
</div>
</section>

<section id="settings" class="page">
<h2>تنظیمات اتصال</h2>
<div class="panel">
<label>آدرس API بک‌اند</label>
<input id="apiBase" placeholder="https://your-worker.workers.dev">
<p class="muted">اگر بک‌اند وجود ندارد، پنل به حالت localStorage می‌رود. برای API واقعی، آدرس Worker یا localhost:3000 را وارد کن.</p>
<div class="actions"><button onclick="saveApi()">ذخیره آدرس API</button><button class="gray" onclick="testApi()">بررسی اتصال</button></div>
</div>
</section>

<section id="account" class="page">
<h2>حساب کاربری</h2>
<div class="panel">
<p class="muted" id="accountInfo">وضعیت ورود و حساب کاربری از API دریافت خواهد شد.</p>
<button class="red" onclick="logout()">خروج از پنل</button>
</div>
</section>
<footer>MHA.NET © VPN MANAGEMENT</footer>
</main>
</div>

<button class="support" onclick="support()" aria-label="پشتیبانی">✈</button>
<div id="toast"></div>

<script>
const API_KEY = 'mha_api_base';
const AUTH_KEY = 'mha_net_token';
const USER_KEY = 'mha_net_user';
const DEFAULT_LOCAL_API = 'http://localhost:3000';
let API_BASE = '';
let CURRENT_USER = null;
let authMode = 'login';

const STORAGE_KEYS = {
  users: 'mha_net_users',
  servers: 'mha_net_servers',
  subscriptions: 'mha_net_subs',
  configs: 'mha_net_configs'
};

function defaultData() {
  return {
    users: [{ id: 1, username: 'admin', password: '123456', status: 'active' }],
    servers: [{ id: 1, name: 'سرور اصلی', host: 'localhost', port: 443, status: 'online' }],
    subscriptions: [{ id: 1, userId: 1, status: 'active', volumeGB: 50, days: 30 }],
    configs: [{ id: 1, name: 'VLESS-01', protocol: 'vless', status: 'active', userId: 1 }]
  };
}

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

function ensureDemoData() {
  const seed = defaultData();
  Object.entries(STORAGE_KEYS).forEach(([key, storeKey]) => {
    const current = readStore(storeKey, seed[key]);
    writeStore(storeKey, current);
  });
}

function normalizeApiBase(value) {
  if (!value || typeof value !== 'string') return '';
  return value.trim().replace(/\/+$/, '');
}

function getDefaultApiBase() {
  const fromQuery = new URLSearchParams(window.location.search).get('api');
  if (fromQuery) return normalizeApiBase(fromQuery);

  try {
    const saved = localStorage.getItem(API_KEY);
    if (saved) return normalizeApiBase(saved);
  } catch (e) {}

  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') {
    return DEFAULT_LOCAL_API;
  }

  return '';
}

function val(id){return document.getElementById(id).value.trim()}

function notify(message){
  const el=document.getElementById('toast');
  el.textContent=message;
  el.style.display='block';
  clearTimeout(window.noticeTimer);
  window.noticeTimer=setTimeout(()=>el.style.display='none',3000);
}

function switchAuthMode(mode){
  authMode = mode;
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginTab = document.getElementById('loginTabBtn');
  const regTab = document.getElementById('registerTabBtn');
  const title = document.getElementById('authTitle');

  if(mode === 'register'){
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    title.textContent = 'ثبت‌نام در پنل';
    loginTab.classList.remove('active');
    regTab.classList.add('active');
  } else {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    title.textContent = 'ورود به پنل';
    regTab.classList.remove('active');
    loginTab.classList.add('active');
  }
}

function toggleMenu(){
  document.getElementById('nav').classList.toggle('open');
}

function page(id,button){
  const loggedIn = !!CURRENT_USER;
  if(!loggedIn && id !== 'auth'){
    notify('لطفاً ابتدا وارد شوید.');
    renderAuthState('auth');
    return;
  }
  document.querySelectorAll('main .page').forEach(x=>x.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));
  if(button)button.classList.add('active');
  document.getElementById('nav').classList.remove('open');
}

function support(){
  window.open('https://t.me/m_hadiii46333','_blank','noopener');
}

function saveApi(){
  API_BASE = normalizeApiBase(val('apiBase'));
  if (API_BASE && !API_BASE.startsWith('http://') && !API_BASE.startsWith('https://')) {
    notify('آدرس API باید با http:// یا https:// شروع شود.');
    return false;
  }
  try{localStorage.setItem(API_KEY,API_BASE)}catch(e){}
  notify(API_BASE ? 'آدرس API ذخیره شد.' : 'حالت LocalStorage فعال شد.');
  return true;
}

function saveAuth(token, user){
  CURRENT_USER = user;
  localStorage.setItem(AUTH_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearAuth(){
  CURRENT_USER = null;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
}

function renderAuthState(forcePage = null){
  const loggedIn = !!CURRENT_USER;
  const authPage = document.getElementById('auth');
  const dashboardPage = document.getElementById('dashboard');
  const logoutBtn = document.querySelector('.logout-btn');

  if (logoutBtn) logoutBtn.style.display = loggedIn ? 'inline-block' : 'none';
  if (authPage) authPage.style.display = loggedIn ? 'none' : 'block';
  if (dashboardPage) dashboardPage.style.display = loggedIn ? 'block' : 'none';

  const activePage = forcePage || (loggedIn ? 'dashboard' : 'auth');
  page(activePage);

  const accountText = document.getElementById('accountInfo');
  if (accountText) {
    accountText.textContent = loggedIn
      ? `وضعیت: وارد شده‌اید | نام کاربری: ${CURRENT_USER.username}`
      : 'وضعیت ورود و حساب کاربری از API دریافت خواهد شد.';
  }
}

function generateToken() {
  return 'local_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function localFallbackRequest(path, method='GET', body=null) {
  ensureDemoData();

  let users = readStore(STORAGE_KEYS.users, defaultData().users);
  let servers = readStore(STORAGE_KEYS.servers, defaultData().servers);
  let subscriptions = readStore(STORAGE_KEYS.subscriptions, defaultData().subscriptions);
  let configs = readStore(STORAGE_KEYS.configs, defaultData().configs);

  if (path === '/api/health') {
    return { ok: true, service: 'MHA.NET API (local fallback)', time: new Date().toISOString() };
  }

  if (path === '/api/auth/register' && method === 'POST') {
    const { username, password } = body || {};
    if (!username || !password) throw new Error('Username and password are required.');
    if (users.some(u => u.username === username)) throw new Error('Username already exists.');
    const user = { id: Date.now(), username, password, status: 'active' };
    users.push(user);
    writeStore(STORAGE_KEYS.users, users);
    const token = generateToken();
    saveAuth(token, { id: user.id, username: user.username, status: user.status });
    return { message: 'Register successful.', token, user: { id: user.id, username: user.username, status: user.status } };
  }

  if (path === '/api/auth/login' && method === 'POST') {
    const { username, password } = body || {};
    if (!username || !password) throw new Error('Username and password are required.');
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) throw new Error('Invalid username or password.');
    const token = generateToken();
    saveAuth(token, { id: user.id, username: user.username, status: user.status });
    return { message: 'Login successful.', token, user: { id: user.id, username: user.username, status: user.status } };
  }

  if (path === '/api/auth/logout' && method === 'POST') {
    clearAuth();
    return { message: 'Logged out successfully.' };
  }

  if (path === '/api/me' && method === 'GET') {
    const savedUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    if (!savedUser) throw new Error('Unauthorized');
    return { id: savedUser.id, username: savedUser.username, status: savedUser.status };
  }

  if (path === '/api/users' && method === 'GET') {
    return users.map(u => ({ id: u.id, username: u.username, status: u.status }));
  }

  if (path === '/api/users' && method === 'POST') {
    const { username, password } = body || {};
    if (!username || !password) throw new Error('Username and password are required.');
    if (users.some(u => u.username === username)) throw new Error('Username already exists.');
    const user = { id: Date.now(), username, password, status: 'active' };
    users.push(user);
    writeStore(STORAGE_KEYS.users, users);
    return { message: 'User created successfully.', user: { id: user.id, username: user.username, status: user.status } };
  }

  if (path === '/api/servers' && method === 'GET') return servers;
  if (path === '/api/servers' && method === 'POST') {
    const { name, host, port } = body || {};
    if (!name || !host || !port) throw new Error('All server fields are required.');
    const server = { id: Date.now(), name, host, port, status: 'active' };
    servers.push(server);
    writeStore(STORAGE_KEYS.servers, servers);
    return { message: 'Server created successfully.', server };
  }

  if (path === '/api/subscriptions' && method === 'GET') return subscriptions;
  if (path === '/api/subscriptions' && method === 'POST') {
    const { userId, volumeGB, days } = body || {};
    if (!userId || !volumeGB || !days) throw new Error('userId, volumeGB and days are required.');
    const sub = { id: Date.now(), userId, volumeGB, days, status: 'active' };
    subscriptions.push(sub);
    writeStore(STORAGE_KEYS.subscriptions, subscriptions);
    return { message: 'Subscription created successfully.', subscription: sub };
  }

  if (path === '/api/configs' && method === 'GET') return configs;
  if (path === '/api/configs' && method === 'POST') {
    const { name, userId, host, port, protocol } = body || {};
    if (!name || !userId || !host || !port || !protocol) throw new Error('All config fields are required.');
    const config = { id: Date.now(), name, userId, host, port, protocol, status: 'active' };
    configs.push(config);
    writeStore(STORAGE_KEYS.configs, configs);
    return { message: 'Config created successfully.', config };
  }

  throw new Error('API endpoint not found.');
}

async function request(path,method='GET',body=null){
  if(!API_BASE){
    API_BASE = getDefaultApiBase();
  }

  if(!API_BASE){
    return localFallbackRequest(path, method, body);
  }

  const token = localStorage.getItem(AUTH_KEY);
  const options={method,headers:{'Content-Type':'application/json'},credentials:'include'};
  if(token) options.headers.Authorization = 'Bearer ' + token;
  if(body!==null)options.body=JSON.stringify(body);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(),15000);
    const response=await fetch(API_BASE + path, { ...options, signal: controller.signal });
    clearTimeout(timeout);
    const contentType = response.headers.get('content-type') || '';
    let data = {};
    if (contentType.includes('application/json')) {
      data = await response.json().catch(() => ({}));
    } else {
      const text = await response.text().catch(() => '');
      data = { message: text || 'Request completed.' };
    }

    if(!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (e) {
    const msg = e && e.message ? e.message : '';
    if (e && e.name === 'AbortError') {
      return localFallbackRequest(path, method, body);
    }
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('HTTP 404')) {
      return localFallbackRequest(path, method, body);
    }
    throw e;
  }
}

async function testApi(){
  try{
    const result=await request('/api/health');
    document.getElementById('connectionStatus').textContent='پاسخ API: '+JSON.stringify(result);
    notify('پاسخ از API دریافت شد.');
  }catch(e){
    document.getElementById('connectionStatus').textContent='ارتباط با API برقرار نشد. آدرس فعلی: ' + API_BASE;
    notify(e.message || 'اتصال برقرار نشد.');
  }
}

async function apiAction(method,path,data){
  for(const [key,value] of Object.entries(data||{})){
    if(value===''||value===null||value===undefined){
      notify('لطفاً تمام اطلاعات لازم را وارد کن.');
      return;
    }
  }
  try{
    const result=await request(path,method,data);
    const msg = result && result.message ? result.message : 'درخواست توسط بک‌اند پردازش شد.';
    notify(msg);
    if(path === '/api/users' || path === '/api/servers' || path === '/api/subscriptions' || path === '/api/configs'){
      const key = path.replace('/api/','').replace(/s$/, '');
      await loadResource(key.toLowerCase());
    }
  }catch(e){
    notify('عملیات انجام نشد: '+(e.message || 'خطای نامشخص'));
  }
}

async function loadResource(resource){
  const paths={
    users:['/api/users','userRows',['id','username','status']],
    servers:['/api/servers','serverRows',['name','host','port']],
    subscriptions:['/api/subscriptions','subRows',['id','userId','status']],
    configs:['/api/configs','configRows',['name','protocol','status']]
  };
  const config=paths[resource];
  if(!config)return;
  try{
    const result=await request(config[0]);
    const rows=Array.isArray(result)?result:(result.data||[]);
    const body=document.getElementById(config[1]);
    body.replaceChildren();
    rows.forEach(item=>{
      const tr=document.createElement('tr');
      config[2].forEach(key=>{
        const td=document.createElement('td');
        td.textContent=item[key]??'—';
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  }catch(e){
    notify('دریافت اطلاعات ناموفق بود: '+(e.message || 'خطای نامشخص'));
  }
}

async function register(){
  const username = val('regUser');
  const password = val('regPass');

  if(!username || !password){
    notify('نام کاربری و رمز عبور را وارد کن.');
    return;
  }

  try{
    const result = await request('/api/auth/register','POST',{ username, password });
    if(result && result.token && result.user){
      saveAuth(result.token, result.user);
      notify('ثبت‌نام موفق بود.');
      renderAuthState('dashboard');
      await loadResource('users');
      await loadResource('servers');
      await loadResource('subscriptions');
      await loadResource('configs');
    } else {
      notify(result && result.message ? result.message : 'ثبت‌نام ناموفق بود.');
    }
  }catch(e){
    notify(e.message || 'ثبت‌نام ناموفق بود.');
  }
}

async function login(){
  if(!val('loginUser')||!val('loginPass')){
    notify('نام کاربری و رمز عبور را وارد کن.');
    return;
  }
  try{
    const result=await request('/api/auth/login','POST',{ username:val('loginUser'), password:val('loginPass') });
    if(result && result.token && result.user){
      saveAuth(result.token, result.user);
      notify('ورود موفق بود.');
      renderAuthState('dashboard');
      await loadResource('users');
      await loadResource('servers');
      await loadResource('subscriptions');
      await loadResource('configs');
    } else {
      notify(result && result.message ? result.message : 'ورود ناموفق بود.');
    }
  }catch(e){
    notify(e.message || 'ورود ناموفق بود.');
  }
}

async function logout(){
  try{
    await request('/api/auth/logout','POST',{});
  }catch(e){}
  clearAuth();
  switchAuthMode('login');
  renderAuthState('auth');
  notify('خارج شدید.');
}

async function initApp(){
  ensureDemoData();
  try{
    API_BASE = normalizeApiBase(localStorage.getItem(API_KEY) || getDefaultApiBase());
    document.getElementById('apiBase').value = API_BASE;
  }catch(e){
    API_BASE = getDefaultApiBase();
  }

  try{
    const savedUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    if(savedUser) CURRENT_USER = savedUser;
    if(CURRENT_USER){
      await request('/api/me');
      renderAuthState('dashboard');
      await loadResource('users');
      await loadResource('servers');
      await loadResource('subscriptions');
      await loadResource('configs');
    }else{
      renderAuthState('auth');
    }
  }catch(e){
    clearAuth();
    renderAuthState('auth');
  }
}

initApp();
</script>
</body>
</html>
