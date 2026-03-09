// ============================================================
// TokenManager.jsx
// Komponen ini MENGGANTIKAN bagian "Connection Config" di
// settings-page pada App.jsx kamu.
//
// CARA PAKAI:
// 1. Taruh file ini di folder src/components/TokenManager.jsx
// 2. Import di App.jsx:
//    import TokenManager from './components/TokenManager';
// 3. Ganti <div className="config-box"> ... </div> dengan:
//    <TokenManager
//      apiBase="https://nama-project-kamu.vercel.app"
//      onConnect={(jwt, device) => { setJwtToken(jwt); setDeviceToken(device); doConnect(); }}
//      onDisconnect={doDisconnect}
//      isOnline={isOnline}
//    />
// ============================================================

import { useEffect, useState } from 'react';

const STYLE = `
  .tm-wrap { display: flex; flex-direction: column; gap: 12px; }
  .tm-section-title { font-size: 11px; font-weight: bold; color: #aaa; letter-spacing: 1px; text-transform: uppercase; margin: 0; }

  /* Saved token list */
  .tm-token-list { display: flex; flex-direction: column; gap: 6px; max-height: 180px; overflow-y: auto; }
  .tm-token-item {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px; padding: 8px 10px; cursor: pointer;
    transition: all 0.15s;
  }
  .tm-token-item:hover { background: rgba(0,200,255,0.08); border-color: rgba(0,200,255,0.3); }
  .tm-token-item.selected { background: rgba(0,200,255,0.12); border-color: #0cf; }
  .tm-token-info { flex: 1; min-width: 0; }
  .tm-token-label { font-size: 12px; font-weight: bold; color: #e0e0e0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tm-token-preview { font-size: 9px; color: #777; font-family: monospace; }
  .tm-btn-delete {
    background: none; border: none; color: #e74c3c; cursor: pointer;
    font-size: 14px; padding: 2px 6px; border-radius: 4px; line-height: 1;
    transition: background 0.15s;
  }
  .tm-btn-delete:hover { background: rgba(231,76,60,0.15); }
  .tm-empty { font-size: 11px; color: #555; text-align: center; padding: 12px 0; }

  /* Add new token form */
  .tm-add-form {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px;
  }
  .tm-add-form.collapsed { display: none; }
  .tm-field-label { font-size: 10px; color: #888; margin-bottom: 2px; }
  .tm-input {
    width: 100%; box-sizing: border-box;
    background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.12);
    color: #e0e0e0; border-radius: 5px; padding: 6px 8px; font-size: 11px;
    font-family: monospace; resize: none;
    transition: border-color 0.15s;
  }
  .tm-input:focus { outline: none; border-color: #0cf; }
  .tm-input::placeholder { color: #444; }

  /* Buttons row */
  .tm-btn-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .tm-btn {
    flex: 1; padding: 7px 10px; border: none; border-radius: 5px;
    font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.15s;
  }
  .tm-btn-save { background: #2ecc71; color: #000; }
  .tm-btn-save:hover { background: #27ae60; }
  .tm-btn-save:disabled { background: #1a4d2e; color: #555; cursor: not-allowed; }
  .tm-btn-toggle-add { background: rgba(0,200,255,0.1); color: #0cf; border: 1px solid rgba(0,200,255,0.25); }
  .tm-btn-toggle-add:hover { background: rgba(0,200,255,0.2); }

  /* Connect row */
  .tm-connect-row { display: flex; gap: 8px; }
  .tm-btn-connect { background: #0cf; color: #000; }
  .tm-btn-connect:hover { background: #00aad4; }
  .tm-btn-connect:disabled { background: #0a3d4d; color: #555; cursor: not-allowed; }
  .tm-btn-disconnect { background: #e74c3c; color: #fff; }
  .tm-btn-disconnect:hover { background: #c0392b; }

  .tm-status-hint { font-size: 10px; color: #666; text-align: center; }
  .tm-status-hint.ok { color: #2ecc71; }
  .tm-status-hint.err { color: #e74c3c; }

  .tm-loading { font-size: 10px; color: #0cf; text-align: center; padding: 8px 0; animation: tmPulse 1s infinite; }
  @keyframes tmPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  .tm-divider { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 4px 0; }
`;

export default function TokenManager({ apiBase = '', onConnect, onDisconnect, isOnline }) {
  const [tokens, setTokens] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState({ msg: '', type: '' });

  // Form state
  const [newLabel, setNewLabel] = useState('');
  const [newJwt, setNewJwt] = useState('');
  const [newDevice, setNewDevice] = useState('');
  const [saving, setSaving] = useState(false);

  const API = `${apiBase}/api/tokens`;

  const showHint = (msg, type = 'ok', ms = 3000) => {
    setHint({ msg, type });
    setTimeout(() => setHint({ msg: '', type: '' }), ms);
  };

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const json = await res.json();
      if (json.success) setTokens(json.data);
    } catch {
      showHint('Gagal memuat token dari server.', 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiBase) fetchTokens();
  }, [apiBase]);

  const handleSave = async () => {
    if (!newLabel.trim() || !newJwt.trim() || !newDevice.trim()) {
      showHint('Semua field wajib diisi!', 'err');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newLabel.trim(), jwtToken: newJwt.trim(), deviceToken: newDevice.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        showHint('✓ Token berhasil disimpan!', 'ok');
        setNewLabel(''); setNewJwt(''); setNewDevice('');
        setShowAddForm(false);
        fetchTokens();
      } else {
        showHint(json.message || 'Gagal menyimpan.', 'err');
      }
    } catch {
      showHint('Koneksi ke API gagal.', 'err');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Hapus token ini?')) return;
    try {
      await fetch(`${API}?id=${id}`, { method: 'DELETE' });
      if (selectedId === id) setSelectedId(null);
      fetchTokens();
      showHint('Token dihapus.', 'ok');
    } catch {
      showHint('Gagal menghapus.', 'err');
    }
  };

  const handleConnect = () => {
    if (!selectedId) { showHint('Pilih token dahulu!', 'err'); return; }
    const t = tokens.find(x => String(x._id) === String(selectedId));
    if (!t) return;
    onConnect(t.jwtToken, t.deviceToken);
  };

  const selectedToken = tokens.find(x => String(x._id) === String(selectedId));

  return (
    <>
      <style>{STYLE}</style>
      <div className="tm-wrap">
        <h3 style={{ marginTop: 0, color: '#e0e0e0' }}>Connection Config</h3>

        {/* ── Saved Tokens ── */}
        <p className="tm-section-title">Token Tersimpan</p>
        {loading
          ? <div className="tm-loading">⟳ Memuat token...</div>
          : tokens.length === 0
            ? <div className="tm-empty">Belum ada token tersimpan.</div>
            : (
              <div className="tm-token-list">
                {tokens.map(t => (
                  <div
                    key={String(t._id)}
                    className={`tm-token-item${String(t._id) === String(selectedId) ? ' selected' : ''}`}
                    onClick={() => setSelectedId(String(t._id))}
                  >
                    <div style={{ fontSize: 18 }}>🔑</div>
                    <div className="tm-token-info">
                      <div className="tm-token-label">{t.label}</div>
                      <div className="tm-token-preview">JWT: {t.jwtPreview} | Device: {t.devicePreview}</div>
                    </div>
                    <button className="tm-btn-delete" onClick={(e) => handleDelete(e, String(t._id))} title="Hapus token">✕</button>
                  </div>
                ))}
              </div>
            )
        }

        {/* ── Connect/Disconnect ── */}
        <div className="tm-connect-row">
          <button
            className="tm-btn tm-btn-connect"
            disabled={!selectedId || isOnline}
            onClick={handleConnect}
          >
            {isOnline ? '✓ CONNECTED' : '⚡ CONNECT'}
          </button>
          <button
            className="tm-btn tm-btn-disconnect"
            disabled={!isOnline}
            onClick={onDisconnect}
          >
            ✕ OFF
          </button>
        </div>

        {hint.msg && <div className={`tm-status-hint ${hint.type}`}>{hint.msg}</div>}
        {selectedToken && !isOnline && (
          <div className="tm-status-hint">Akan connect dengan: <b style={{ color: '#0cf' }}>{selectedToken.label}</b></div>
        )}

        <hr className="tm-divider" />

        {/* ── Add New Token ── */}
        <button
          className="tm-btn tm-btn-toggle-add"
          onClick={() => setShowAddForm(v => !v)}
        >
          {showAddForm ? '▲ Tutup Form' : '＋ Tambah Token Baru'}
        </button>

        <div className={`tm-add-form${showAddForm ? '' : ' collapsed'}`}>
          <p className="tm-section-title" style={{ marginBottom: 4 }}>Simpan Token Baru</p>

          <div>
            <div className="tm-field-label">NAMA / LABEL</div>
            <input className="tm-input" placeholder="cth: ThingsBoard Demo - Tank A" value={newLabel} onChange={e => setNewLabel(e.target.value)} />
          </div>
          <div>
            <div className="tm-field-label">JWT TOKEN (eyJ...)</div>
            <textarea className="tm-input" rows={3} placeholder="Paste JWT token dari LocalStorage ThingsBoard" value={newJwt} onChange={e => setNewJwt(e.target.value)} />
          </div>
          <div>
            <div className="tm-field-label">DEVICE ACCESS TOKEN</div>
            <input className="tm-input" placeholder="Paste Access Token perangkat" value={newDevice} onChange={e => setNewDevice(e.target.value)} />
          </div>

          <div className="tm-btn-row">
            <button className="tm-btn tm-btn-save" disabled={saving} onClick={handleSave}>
              {saving ? '⟳ Menyimpan...' : '💾 Simpan ke Database'}
            </button>
          </div>
        </div>

        <hr className="tm-divider" />
        <button
          onClick={() => alert('Panduan:\n1. Buka demo.thingsboard.io dan login.\n2. Tekan F12 > Application > Local Storage.\n3. Klik domain ThingsBoard, cari key jwt_token.\n4. Copy dan paste ke form di atas.')}
          style={{ width: '100%', padding: 8, cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: '#888', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, fontSize: 11 }}
        >
          ❓ Panduan Pengambilan Token
        </button>
      </div>
    </>
  );
}
