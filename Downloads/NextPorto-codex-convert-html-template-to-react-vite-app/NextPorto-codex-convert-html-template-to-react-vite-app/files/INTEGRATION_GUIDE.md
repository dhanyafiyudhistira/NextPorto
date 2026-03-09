# Cara Integrasi TokenManager ke App.jsx

## Langkah 1 — Import komponen

Tambahkan di bagian atas App.jsx:

```jsx
import TokenManager from './components/TokenManager';
```

---

## Langkah 2 — Tambah state untuk apiBase

Di dalam `export default function App()`, tambahkan:

```jsx
const API_BASE = 'https://nama-project-kamu.vercel.app'; // ganti dengan URL Vercel kamu
```

---

## Langkah 3 — Update fungsi doConnect

Ubah `doConnect` agar bisa menerima jwt & deviceToken dari luar:

```jsx
const doConnect = async (jwt, device) => {
  // Jika dipanggil dari TokenManager, pakai nilai dari parameter
  const activeJwt = jwt || jwtToken;
  const activeDevice = device || deviceToken;

  if (!activeJwt.trim() || !activeDevice.trim()) {
    alert('Token tidak valid!');
    return;
  }

  // Update state sebelum connect
  setJwtToken(activeJwt);
  setDeviceToken(activeDevice);

  try {
    const res = await fetch(`${TB_HTTP}/api/tenant/devices?pageSize=100&page=0`, {
      headers: { 'X-Authorization': `Bearer ${activeJwt}` },
    });
    if (!res.ok) throw new Error('Gagal ambil devices: JWT expired');
    const data = await res.json();
    const id = data.data[0].id.id;
    setDeviceId(id);
    log('✓ Device ditemukan', 'ok');
    connectWS(id, activeJwt); // teruskan jwt ke connectWS
  } catch (e) {
    setIsOnline(false);
    log(e.message, 'err');
  }
};
```

Update juga `connectWS` untuk terima parameter jwt:

```jsx
const connectWS = (id, activeJwt) => {
  const token = activeJwt || jwtToken; // fallback ke state
  const ws = new WebSocket(TB_WS);
  wsRef.current = ws;

  ws.onopen = () => {
    ws.send(JSON.stringify({
      authCmd: { cmdId: 0, token: token },
      cmds: [{ cmdId: 10, entityType: 'DEVICE', entityId: id, scope: 'LATEST_TELEMETRY', type: 'TIMESERIES' }],
    }));
    setIsOnline(true);
    log('WebSocket Aktif!', 'ok');
    setTimeout(() => setActivePage('main-page'), 1000);
  };
  // ... sisa handler sama
};
```

---

## Langkah 4 — Ganti config-box di settings-page

Di dalam `<div id="settings-page">`, **ganti** ini:

```jsx
<div className="config-box">
  <h3 style={{ marginTop: 0 }}>Connection Config</h3>
  <label className="field-label">JWT TOKEN (eyJ...)</label>
  <textarea ... />
  <label className="field-label">DEVICE ACCESS TOKEN</label>
  <input ... />
  <div style={{ display: 'flex', gap: 10 }}>
    <button id="btn-connect" ... >CONNECT</button>
    <button id="btn-disconnect" ... >OFF</button>
  </div>
  <hr ... />
  <button onClick={() => setShowGuide(true)} ...>Buka Panduan...</button>
</div>
```

**Dengan** ini:

```jsx
<div className="config-box">
  <TokenManager
    apiBase={API_BASE}
    onConnect={(jwt, device) => doConnect(jwt, device)}
    onDisconnect={doDisconnect}
    isOnline={isOnline}
  />
</div>
```

---

## Langkah 5 — Setup MongoDB Atlas

1. Buka https://cloud.mongodb.com
2. Buat cluster baru (gratis M0 cukup)
3. Buat database: `scada_db`, collection: `tokens`
4. Di **Network Access**, tambahkan IP: `0.0.0.0/0` (allow all — untuk Vercel)
5. Copy **Connection String** (format: `mongodb+srv://...`)

---

## Langkah 6 — Deploy ke Vercel

1. Push semua file ke GitHub repository
2. Import project di https://vercel.com/new
3. Di **Settings > Environment Variables**, tambahkan:
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://username:password@cluster.mongodb.net/scada_db?retryWrites=true&w=majority`
4. Deploy!
5. Copy URL Vercel (cth: `https://scada-token.vercel.app`)
6. Update `API_BASE` di App.jsx dengan URL tersebut

---

## Struktur File Final

```
project/
├── api/
│   └── tokens.js          ← Serverless API (MongoDB CRUD)
├── src/
│   ├── components/
│   │   └── TokenManager.jsx  ← Komponen baru
│   └── App.jsx            ← File kamu (dimodifikasi)
├── vercel.json
├── package.json
└── .env.example
```
