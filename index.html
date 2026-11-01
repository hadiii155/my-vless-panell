
const APP = "MHA.NET";

/* =========================
   DATABASE SCHEMA
   هر جدول جداگانه ساخته می‌شود
========================= */

const SCHEMA = [
`CREATE TABLE IF NOT EXISTS admins (
 id INTEGER PRIMARY KEY,
 username TEXT NOT NULL,
 password_hash TEXT NOT NULL,
 password_salt TEXT NOT NULL,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
)`,

`CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 note TEXT DEFAULT '',
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
)`,

`CREATE TABLE IF NOT EXISTS subscriptions (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL,
 token TEXT UNIQUE NOT NULL,
 volume_gb INTEGER NOT NULL,
 used_bytes INTEGER DEFAULT 0,
 days INTEGER NOT NULL,
 expires_at TEXT NOT NULL,
 status TEXT DEFAULT 'active',
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
)`,

`CREATE TABLE IF NOT EXISTS configs (
 id TEXT PRIMARY KEY,
 subscription_id TEXT NOT NULL,
 protocol TEXT DEFAULT 'VLESS',
 uuid TEXT NOT NULL,
 server_id TEXT DEFAULT '',
 status TEXT DEFAULT 'waiting_for_vps',
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
)`,

`CREATE TABLE IF NOT EXISTS settings (
 key TEXT PRIMARY KEY,
 value TEXT NOT NULL
)`
];

/* =========================
   HELPERS
========================= */

const enc = new TextEncoder();
const dec = new TextDecoder();

function b64(bytes) {
 return btoa(String.fromCharCode(...new Uint8Array(bytes)))
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=+$/g, "");
}

function unb64(value) {
 const base = value.replace(/-/g, "+").replace(/_/g, "/");
 const padded = base + "=".repeat((4 - base.length % 4) % 4);
 return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}

function json(data, status = 200, headers = {}) {
 return new Response(JSON.stringify(data), {
  status,
  headers: {
   "Content-Type": "application/json; charset=UTF-8",
   "Cache-Control": "no-store",
   ...headers
  }
 });
}

function uid() {
 return crypto.randomUUID();
}

function randomToken() {
 return b64(crypto.getRandomValues(new Uint8Array(32)));
}

async function digest(password, salt) {
 const key = await crypto.subtle.importKey(
  "raw",
  enc.encode(password),
  "PBKDF2",
  false,
  ["deriveBits"]
 );

 const bits = await crypto.subtle.deriveBits({
  name: "PBKDF2",
  salt: enc.encode(salt),
  iterations: 150000,
  hash: "SHA-256"
 }, key, 256);

 return b64(bits);
}

async function sign(value, secret) {
 const key = await crypto.subtle.importKey(
  "raw",
  enc.encode(secret),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign"]
 );

 return b64(await crypto.subtle.sign(
  "HMAC",
  key,
  enc.encode(value)
 ));
}

function safeEqual(a, b) {
 if (typeof a !== "string" || typeof b !== "string") return false;
 if (a.length !== b.length) return false;

 let result = 0;
 for (let i = 0; i < a.length; i++) {
  result |= a.charCodeAt(i) ^ b.charCodeAt(i);
 }
 return result === 0;
}

/* =========================
   INITIALIZE DATABASE
========================= */

async function init(env) {
 if (!env.DB) {
  throw new Error("D1 binding DB is missing");
 }

 if (
  !env.ADMIN_USERNAME ||
  !env.ADMIN_PASSWORD ||
  !env.SESSION_SECRET
 ) {
  throw new Error(
   "ADMIN_USERNAME, ADMIN_PASSWORD and SESSION_SECRET must be configured"
  );
 }

 for (const statement of SCHEMA) {
  await env.DB.prepare(statement).run();
 }

 const existing = await env.DB.prepare(
  "SELECT id FROM admins LIMIT 1"
 ).first();

 if (!existing) {
  const salt = randomToken();
  const hash = await digest(env.ADMIN_PASSWORD, salt);

  await env.DB.prepare(
   `INSERT INTO admins
    (username, password_hash, password_salt)
    VALUES (?, ?, ?)`
  ).bind(
   env.ADMIN_USERNAME,
   hash,
   salt
  ).run();
 }
}

/* =========================
   SESSION
========================= */

function cookie(value, maxAge) {
 return `mha_session=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}

async function createSession(username, env) {
 const payload = b64(enc.encode(JSON.stringify({
  username,
  exp: Date.now() + 86400000
 })));

 const signature = await sign(payload, env.SESSION_SECRET);
 return payload + "." + signature;
}

async function getSession(request, env) {
 const cookieHeader = request.headers.get("Cookie") || "";
 const match = cookieHeader.match(/(?:^|;\s*)mha_session=([^;]+)/);

 if (!match) return false;

 const parts = match[1].split(".");
 if (parts.length !== 2) return false;

 const [payload, signature] = parts;

 const expected = await sign(payload, env.SESSION_SECRET);
 if (!safeEqual(signature, expected)) return false;

 try {
  const data = JSON.parse(dec.decode(unb64(payload)));
  if (!data.exp || data.exp <= Date.now()) return false;
  return data;
 } catch {
  return false;
 }
}

/* =========================
   API
========================= */

async function api(request, env) {
 const url = new URL(request.url);
 const path = url.pathname;
 const method = request.method;

 if (method === "OPTIONS") {
  return new Response(null, { status: 204 });
 }

 /* LOGIN */

 if (method === "POST" && path === "/api/login") {
  const body = await request.json();

  const admin = await env.DB.prepare(
   "SELECT * FROM admins LIMIT 1"
  ).first();

  if (
   !admin ||
   body.username !== admin.username ||
   !safeEqual(
    await digest(String(body.password || ""), admin.password_salt),
    admin.password_hash
   )
  ) {
   return json({
    ok: false,
    error: "نام کاربری یا رمز عبور اشتباه است"
   }, 401);
  }

  const token = await createSession(admin.username, env);

  return json({
   ok: true,
   username: admin.username
  }, 200, {
   "Set-Cookie": cookie(token, 86400)
  });
 }

 /* LOGOUT */

 if (method === "POST" && path === "/api/logout") {
  return json({ ok: true }, 200, {
   "Set-Cookie": cookie("", 0)
  });
 }

 /* AUTHENTICATION */

 const session = await getSession(request, env);

 if (!session) {
  return json({
   ok: false,
   error: "لطفاً ابتدا وارد پنل شوید"
  }, 401);
 }

 /* CURRENT ADMIN */

 if (method === "GET" && path === "/api/me") {
  return json({
   ok: true,
   username: session.username
  });
 }

 /* CHANGE PASSWORD */

 if (method === "POST" && path === "/api/password") {
  const body = await request.json();

  const admin = await env.DB.prepare(
   "SELECT * FROM admins LIMIT 1"
  ).first();

  if (!admin) {
   return json({ error: "مدیر پیدا نشد" }, 404);
  }

  const oldHash = await digest(
   String(body.oldPassword || ""),
   admin.password_salt
  );

  if (!safeEqual(oldHash, admin.password_hash)) {
   return json({ error: "رمز قبلی اشتباه است" }, 400);
  }

  if (
   typeof body.newPassword !== "string" ||
   body.newPassword.length < 12
  ) {
   return json({
    error: "رمز جدید باید حداقل ۱۲ کاراکتر باشد"
   }, 400);
  }

  const salt = randomToken();
  const hash = await digest(body.newPassword, salt);

  await env.DB.prepare(
   `UPDATE admins
    SET password_hash = ?, password_salt = ?
    WHERE id = ?`
  ).bind(hash, salt, admin.id).run();

  return json({ ok: true, message: "رمز عبور تغییر کرد" });
 }

 /* DASHBOARD DATA */

 if (method === "GET" && path === "/api/data") {
  const [users, subs, configs, settings] = await Promise.all([
   env.DB.prepare(
    "SELECT * FROM users ORDER BY created_at DESC"
   ).all(),

   env.DB.prepare(
    "SELECT * FROM subscriptions ORDER BY created_at DESC"
   ).all(),

   env.DB.prepare(
    "SELECT * FROM configs ORDER BY created_at DESC"
   ).all(),

   env.DB.prepare(
    "SELECT * FROM settings"
   ).all()
  ]);

  return json({
   ok: true,
   users: users.results,
   subscriptions: subs.results,
   configs: configs.results,
   settings: settings.results
  });
 }

 /* CREATE USER */

 if (method === "POST" && path === "/api/users") {
  const body = await request.json();

  const name = String(body.name || "").trim();

  if (!name) {
   return json({ error: "نام کاربر الزامی است" }, 400);
  }

  const id = uid();

  await env.DB.prepare(
   "INSERT INTO users (id, name, note) VALUES (?, ?, ?)"
  ).bind(
   id,
   name.slice(0, 100),
   String(body.note || "").slice(0, 500)
  ).run();

  return json({ ok: true, id });
 }

 /* CREATE SUBSCRIPTION */

 if (method === "POST" && path === "/api/subscriptions") {
  const body = await request.json();

  const user = await env.DB.prepare(
   "SELECT id FROM users WHERE id = ?"
  ).bind(body.user_id).first();

  const volume = Number(body.volume_gb);
  const days = Number(body.days);

  if (
   !user ||
   !Number.isInteger(volume) ||
   volume < 1 ||
   volume > 100000 ||
   !Number.isInteger(days) ||
   days < 1 ||
   days > 3650
  ) {
   return json({
    error: "اطلاعات اشتراک معتبر نیست"
   }, 400);
  }

  const id = uid();
  const token = randomToken();
  const expires = new Date(
   Date.now() + days * 86400000
  ).toISOString();

  await env.DB.prepare(
   `INSERT INTO subscriptions
    (id, user_id, token, volume_gb, days, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(
   id,
   body.user_id,
   token,
   volume,
   days,
   expires
  ).run();

  return json({
   ok: true,
   id,
   token,
   expires_at: expires,
   subscription_path: "/sub/" + token
  });
 }

 /* CREATE CONFIG */

 if (method === "POST" && path === "/api/configs") {
  const body = await request.json();

  const sub = await env.DB.prepare(
   "SELECT id FROM subscriptions WHERE id = ?"
  ).bind(body.subscription_id).first();

  if (!sub) {
   return json({ error: "اشتراک پیدا نشد" }, 404);
  }

  const id = uid();
  const uuid = uid();

  await env.DB.prepare(
   `INSERT INTO configs
    (id, subscription_id, protocol, uuid, status)
    VALUES (?, ?, ?, ?, ?)`
  ).bind(
   id,
   body.subscription_id,
   "VLESS",
   uuid,
   "waiting_for_vps"
  ).run();

  return json({
   ok: true,
   id,
   uuid,
   status: "waiting_for_vps",
   message: "رکورد ساخته شد؛ فعال‌سازی اتصال واقعی به VPS نیاز دارد."
  });
 }

 /* SAVE SETTINGS */

 if (method === "POST" && path === "/api/settings") {
  const body = await request.json();

  const allowed = ["theme", "language"];

  if (!allowed.includes(body.key)) {
   return json({ error: "تنظیم نامعتبر است" }, 400);
  }

  await env.DB.prepare(
   `INSERT INTO settings (key, value)
    VALUES (?, ?)
    ON CONFLICT(key)
    DO UPDATE SET value = excluded.value`
  ).bind(
   body.key,
   String(body.value || "").slice(0, 30)
  ).run();

  return json({ ok: true });
 }

 /* DELETE USER / SUBSCRIPTION / CONFIG */

 const remove = path.match(
  /^\/api\/(users|subscriptions|configs)\/([a-f0-9-]+)$/i
 );

 if (method === "DELETE" && remove) {
  const type = remove[1];
  const id = remove[2];

  if (type === "users") {
   await env.DB.prepare(
    "DELETE FROM configs WHERE subscription_id IN (SELECT id FROM subscriptions WHERE user_id = ?)"
   ).bind(id).run();

   await env.DB.prepare(
    "DELETE FROM subscriptions WHERE user_id = ?"
   ).bind(id).run();
  }

  if (type === "subscriptions") {
   await env.DB.prepare(
    "DELETE FROM configs WHERE subscription_id = ?"
   ).bind(id).run();
  }

  const tables = {
   users: "users",
   subscriptions: "subscriptions",
   configs: "configs"
  };

  await env.DB.prepare(
   `DELETE FROM ${tables[type]} WHERE id = ?`
  ).bind(id).run();

  return json({ ok: true });
 }

 return json({
  ok: false,
  error: "API route not found"
 }, 404);
}

/* =========================
   SUBSCRIPTION PAGE
========================= */

async function subscriptionPage(request, env) {
 const url = new URL(request.url);
 const token = url.pathname.slice(5);

 if (!token) {
  return new Response("Subscription not found", { status: 404 });
 }

 const sub = await env.DB.prepare(
  `SELECT id, volume_gb, used_bytes, days, expires_at, status
   FROM subscriptions WHERE token = ?`
 ).bind(token).first();

 if (!sub) {
  return new Response("Subscription not found", { status: 404 });
 }

 return json({
  app: APP,
  subscription: sub,
  note: "اتصال واقعی پس از راه‌اندازی VPS و Xray فعال می‌شود."
 });
}

/* =========================
   ADMIN PANEL UI
========================= */

const PAGE = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MHA.NET Admin</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#10091b;color:#f5edff;font-family:Tahoma,Arial}
button,input,select{font:inherit}
button{cursor:pointer;border:0;border-radius:9px;padding:11px 16px;background:#7900bd;color:white}
button:hover{filter:brightness(1.2)}
input,select{width:100%;padding:12px;background:#1b1028;color:white;border:1px solid #60328a;border-radius:8px;margin:6px 0 14px}
.login{max-width:390px;margin:12vh auto;padding:25px;background:#1b1028;border:1px solid #8a27ce;border-radius:18px}
.layout{display:none;min-height:100vh}
aside{width:230px;background:#190d27;padding:20px;position:fixed;inset:0 0 0 auto;border-left:1px solid #54247b;min-height:100vh}
main{margin-right:230px;padding:25px;max-width:1300px}
.logo{font-size:27px;font-weight:bold;color:#ff7819;margin:15px 0 35px}
nav button{display:block;width:100%;text-align:right;margin:8px 0;background:#29143d}
nav button:hover,.active{background:#7500a8}
.card{background:#1d112b;border:1px solid #542777;padding:18px;border-radius:13px;margin:12px 0}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px}
h2{color:#ff8a28}
.small{color:#bda9d1;font-size:12px;line-height:1.8}
table{width:100%;border-collapse:collapse;display:block;overflow:auto}
td,th{text-align:right;padding:11px;border-bottom:1px solid #40234e;white-space:nowrap}
.form{max-width:550px}
.hidden{display:none!important}
.danger{background:#9b172e}
.copy{background:#246b49}
.status{color:#ffb15c}
a{color:#ff9b45;overflow-wrap:anywhere}
@media(max-width:700px){
 aside{position:relative;width:100%;inset:auto;min-height:auto}
 main{margin:0;padding:12px}
 nav{display:grid;grid-template-columns:1fr 1fr;gap:5px}
 nav button{margin:3px 0;font-size:12px;padding:10px 5px}
 .logo{margin:5px 0 15px}
}
</style>
</head>
<body>

<section class="login" id="login">
<h1 class="logo">🦁 MHA.NET</h1>
<h2>ورود مدیر</h2>
<form id="loginForm">
<label>نام کاربری</label>
<input id="username" autocomplete="username" required>
<label>رمز عبور</label>
<input id="password" type="password" autocomplete="current-password" required>
<button style="width:100%">ورود به پنل</button>
<p id="loginError" class="small"></p>
</form>
</section>

<div class="layout" id="app">
<aside>
<div class="logo">🦁 MHA.NET</div>
<nav>
<button onclick="show('home')">داشبورد</button>
<button onclick="show('users')">مدیریت کاربران</button>
<button onclick="show('subs')">سابسکریپشن</button>
<button onclick="show('configs')">ساخت کانفیگ</button>
<button onclick="show('settings')">تنظیمات و ظاهر</button>
<button onclick="show('passwordPage')">تغییر رمز</button>
<button onclick="window.open('https://t.me/m_hadiii46333','_blank')">پشتیبانی تلگرام</button>
<button class="danger" onclick="logout()">خروج</button>
</nav>
<p class="small">MHA.NET © 2026</p>
</aside>

<main>
<h2 id="heading">داشبورد مدیریت</h2>

<div id="home" class="page">
 <div class="grid">
  <div class="card">کاربران<h2 id="uc">0</h2></div>
  <div class="card">اشتراک‌ها<h2 id="sc">0</h2></div>
  <div class="card">کانفیگ‌ها<h2 id="cc">0</h2></div>
 </div>
 <div class="card">
  وضعیت VPS: <b class="status">هنوز متصل نشده</b>
  <p class="small">برای ساخت اتصال واقعی VLESS باید VPS و Xray راه‌اندازی شوند.</p>
 </div>
</div>

<div id="users" class="page hidden">
 <div class="card form">
  <h3>افزودن کاربر</h3>
  <input id="newUser" placeholder="نام کاربر">
  <input id="userNote" placeholder="توضیحات اختیاری">
  <button onclick="addUser()">ایجاد کاربر</button>
 </div>
 <div class="card">
  <h3>کاربران</h3>
  <div id="userList"></div>
 </div>
</div>

<div id="subs" class="page hidden">
 <div class="card form">
  <h3>ساخت اشتراک</h3>
  <label>انتخاب کاربر</label>
  <select id="subUser"></select>
  <label>حجم به GB</label>
  <input id="volume" type="number" min="1" value="10">
  <label>اعتبار به روز</label>
  <input id="days" type="number" min="1" value="30">
  <button onclick="addSub()">ایجاد اشتراک</button>
 </div>
 <div class="card">
  <h3>اشتراک‌ها</h3>
  <div id="subList"></div>
 </div>
</div>

<div id="configs" class="page hidden">
 <div class="card form">
  <h3>ساخت کانفیگ</h3>
  <select id="configSub"></select>
  <button onclick="addConfig()">ساخت کانفیگ</button>
  <p class="small">فعلاً UUID و رکورد کانفیگ در دیتابیس ساخته می‌شود. اتصال VLESS تا راه‌اندازی VPS فعال نیست.</p>
 </div>
 <div class="card">
  <h3>کانفیگ‌ها</h3>
  <div id="configList"></div>
 </div>
</div>

<div id="settings" class="page hidden">
 <div class="card form">
  <h3>تنظیمات پنل</h3>
  <label>زبان</label>
  <select id="language">
   <option value="fa">فارسی</option>
   <option value="tr">Türkçe</option>
   <option value="en">English</option>
  </select>
  <label>تم</label>
  <select id="theme">
   <option value="dark">تاریک</option>
   <option value="purple">بنفش</option>
  </select>
  <button onclick="saveSettings()">ذخیره تنظیمات</button>
 </div>
</div>

<div id="passwordPage" class="page hidden">
 <div class="card form">
  <h3>تغییر رمز مدیر</h3>
  <input id="oldPassword" type="password" placeholder="رمز فعلی">
  <input id="newPassword" type="password" placeholder="رمز جدید، حداقل ۱۲ کاراکتر">
  <button onclick="changePassword()">تغییر رمز</button>
 </div>
</div>

<p id="message" class="small"></p>
</main>
</div>

<script>
let data={users:[],subscriptions:[],configs:[]};

const $=id=>document.getElementById(id);

async function call(path,method="GET",body){
 const r=await fetch(path,{
  method,
  credentials:"same-origin",
  headers:{"Content-Type":"application/json"},
  body:body?JSON.stringify(body):undefined
 });

 const d=await r.json().catch(()=>({error:"پاسخ نامعتبر از سرور"}));

 if(!r.ok) throw Error(d.error||"خطا در درخواست");
 return d;
}

function msg(text){
 $("message").textContent=text;
}

function esc(value){
 return String(value??"").replace(/[&<>"']/g,c=>({
  "&":"&amp;",
  "<":"&lt;",
  ">":"&gt;",
  '"':"&quot;",
  "'":"&#39;"
 }[c]));
}

$("loginForm").onsubmit=async e=>{
 e.preventDefault();
 $("loginError").textContent="";

 try{
  await call("/api/login","POST",{
   username:$("username").value,
   password:$("password").value
  });
  await start();
 }catch(err){
  $("loginError").textContent=err.message;
 }
};

async function start(){
 await call("/api/me");
 $("login").style.display="none";
 $("app").style.display="block";
 await refresh();
}

async function refresh(){
 data=await call("/api/data");

 $("uc").textContent=data.users.length;
 $("sc").textContent=data.subscriptions.length;
 $("cc").textContent=data.configs.length;

 $("userList").innerHTML=data.users.map(x=>
  '<p>'+esc(x.name)+' — '+esc(x.note)+
  ' <button class="danger" onclick="del(\\'users\\',\\''+x.id+'\\')">حذف</button></p>'
 ).join("") || '<p class="small">هنوز کاربری ثبت نشده است.</p>';

 $("subUser").innerHTML=data.users.map(x=>
  '<option value="'+esc(x.id)+'">'+esc(x.name)+'</option>'
 ).join("");

 $("configSub").innerHTML=data.subscriptions.map(x=>
  '<option value="'+esc(x.id)+'">'+esc(x.id.slice(0,8))+
  ' — '+esc(x.volume_gb)+'GB</option>'
 ).join("");

 $("subList").innerHTML=data.subscriptions.map(x=>
  '<div class="card">'+
  '<p>حجم: '+esc(x.volume_gb)+'GB | اعتبار: '+esc(x.days)+' روز</p>'+
  '<p>وضعیت: '+esc(x.status)+'</p>'+
  '<p>انقضا: '+esc(x.expires_at)+'</p>'+
  '<p>لینک اشتراک: <a href="/sub/'+encodeURIComponent(x.token)+'" target="_blank">مشاهده لینک</a></p>'+
  '<button class="copy" onclick="copyText(\\''+location.origin+'/sub/'+x.token+'\\')">کپی لینک</button> '+
  '<button class="danger" onclick="del(\\'subscriptions\\',\\''+x.id+'\\')">حذف</button>'+
  '</div>'
 ).join("") || '<p class="small">هنوز اشتراکی ساخته نشده است.</p>';

 $("configList").innerHTML=data.configs.map(x=>
  '<div class="card">'+
  '<p>پروتکل: '+esc(x.protocol)+'</p>'+
  '<p>UUID: '+esc(x.uuid)+'</p>'+
  '<p>وضعیت: '+esc(x.status)+'</p>'+
  '<button class="danger" onclick="del(\\'configs\\',\\''+x.id+'\\')">حذف</button>'+
  '</div>'
 ).join("") || '<p class="small">هنوز کانفیگی ساخته نشده است.</p>';

 const settings=Object.fromEntries(
  data.settings.map(x=>[x.key,x.value])
 );

 if(settings.language) $("language").value=settings.language;
 if(settings.theme) $("theme").value=settings.theme;
}

async function addUser(){
 try{
  await call("/api/users","POST",{
   name:$("newUser").value,
   note:$("userNote").value
  });

  $("newUser").value="";
  $("userNote").value="";
  await refresh();
  msg("کاربر ذخیره شد");
 }catch(e){
  msg(e.message);
 }
}

async function addSub(){
 try{
  if(!$("subUser").value){
   msg("ابتدا یک کاربر ایجاد کنید");
   return;
  }

  const result=await call("/api/subscriptions","POST",{
   user_id:$("subUser").value,
   volume_gb:$("volume").value,
   days:$("days").value
  });

  await refresh();
  msg("اشتراک ایجاد شد. لینک: "+location.origin+result.subscription_path);
 }catch(e){
  msg(e.message);
 }
}

async function addConfig(){
 try{
  if(!$("configSub").value){
   msg("ابتدا یک اشتراک ایجاد کنید");
   return;
  }

  const result=await call("/api/configs","POST",{
   subscription_id:$("configSub").value,
   protocol:"VLESS"
  });

  await refresh();
  msg("رکورد ساخته شد. UUID: "+result.uuid+" | فعال‌سازی نیازمند VPS است.");
 }catch(e){
  msg(e.message);
 }
}

async function del(type,id){
 if(!confirm("از حذف این مورد مطمئن هستید؟"))return;

 try{
  await call("/api/"+type+"/"+id,"DELETE");
  await refresh();
  msg("حذف انجام شد");
 }catch(e){
  msg(e.message);
 }
}

async function changePassword(){
 try{
  await call("/api/password","POST",{
   oldPassword:$("oldPassword").value,
   newPassword:$("newPassword").value
  });

  msg("رمز تغییر کرد؛ دوباره وارد شوید");
  await logout();
 }catch(e){
  msg(e.message);
 }
}

async function saveSettings(){
 try{
  await call("/api/settings","POST",{
   key:"language",
   value:$("language").value
  });

  await call("/api/settings","POST",{
   key:"theme",
   value:$("theme").value
  });

  msg("تنظیمات ذخیره شد");
 }catch(e){
  msg(e.message);
 }
}

async function logout(){
 try{
  await call("/api/logout","POST");
 }catch{}

 location.reload();
}

function show(id){
 document.querySelectorAll(".page").forEach(x=>
  x.classList.add("hidden")
 );

 $(id).classList.remove("hidden");

 const titles={
  home:"داشبورد مدیریت",
  users:"مدیریت کاربران",
  subs:"مدیریت اشتراک‌ها",
  configs:"مدیریت کانفیگ‌ها",
  settings:"تنظیمات پنل",
  passwordPage:"تغییر رمز مدیر"
 };

 $("heading").textContent=titles[id]||"MHA.NET";
}

async function copyText(text){
 try{
  await navigator.clipboard.writeText(text);
  msg("لینک کپی شد");
 }catch{
  msg("کپی خودکار انجام نشد؛ لینک را دستی کپی کنید");
 }
}

start().catch(()=>{
 $("login").style.display="block";
 $("app").style.display="none";
});
</script>
</body>
</html>`;

/* =========================
   WORKER ENTRY
========================= */

export default {
 async fetch(request, env) {
  try {
   await init(env);

   const url = new URL(request.url);

   if (url.pathname.startsWith("/api/")) {
    return await api(request, env);
   }

   if (url.pathname.startsWith("/sub/")) {
    return await subscriptionPage(request, env);
   }

   return new Response(PAGE, {
    headers: {
     "Content-Type": "text/html; charset=UTF-8",
     "Cache-Control": "no-store"
    }
   });

  } catch (error) {
   return json({
    ok: false,
    error: error.message || "Internal server error"
   }, 500);
  }
 }
};
