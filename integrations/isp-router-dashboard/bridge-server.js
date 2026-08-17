#!/usr/bin/env node
/**
 * Lightweight isp.router-dashboard bridge used when the full Open5GS WebUI
 * (Next 3 / Node 19) is not running. Exposes the same /api/apigate routes
 * and a status page that lists Open5GS subscribers.
 */
const express = require('express');
const { MongoClient } = require('mongodb');
const apigate = require('./webui/server/routes/apigate');

const PORT = Number(process.env.PORT || 9999);
const DB_URI = process.env.DB_URI || process.env.OPEN5GS_MONGODB_URI || 'mongodb://127.0.0.1:27017/open5gs';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function main() {
  const client = new MongoClient(DB_URI);
  await client.connect();
  const db = client.db('open5gs');
  const subscribers = db.collection('subscribers');

  const app = express();
  app.use('/api/apigate', apigate);

  app.get('/api/db/subscribers', async (_req, res) => {
    const docs = await subscribers.find({}, { projection: { security: 0 } }).toArray();
    res.json(docs);
  });

  app.get('/', async (_req, res) => {
    const docs = await subscribers.find({}, { projection: { security: 0 } }).toArray();
    const rows = docs.map((d) => `<tr><td>${escapeHtml(d.imsi)}</td><td>${escapeHtml(d.slice?.[0]?.session?.[0]?.name || 'internet')}</td><td>${d.subscriber_status === 0 ? 'Granted' : 'Barred'}</td></tr>`).join('');
    res.type('html').send(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Open5GS Router Dashboard · ApiGate</title>
  <style>
    body { font-family: sans-serif; background:#0b1220; color:#e8eef8; margin:0; }
    header { padding:24px 32px; background:#132038; border-bottom:1px solid #243656; }
    main { padding:32px; }
    .ok { color:#3ddc97; }
    table { border-collapse:collapse; width:100%; max-width:800px; }
    th, td { text-align:left; padding:8px 12px; border-bottom:1px solid #243656; }
    a { color:#4da3ff; }
  </style>
</head>
<body>
  <header>
    <h1>isp.router-dashboard</h1>
    <p>Open5GS subscriber store bridged to <a href="http://localhost:4000/health">ApiGate</a></p>
  </header>
  <main>
    <p class="ok">MongoDB connected · ${docs.length} subscriber(s)</p>
    <p>
      <a href="/api/apigate/health">/api/apigate/health</a> ·
      <a href="/api/apigate/network">/api/apigate/network</a>
    </p>
    <table>
      <thead><tr><th>IMSI</th><th>APN</th><th>Status</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="3">No subscribers yet. Activate a SIM in ApiGate.</td></tr>'}</tbody>
    </table>
  </main>
</body>
</html>`);
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Open5GS router dashboard bridge on http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
