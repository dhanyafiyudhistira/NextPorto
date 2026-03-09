import { useEffect, useMemo, useRef, useState } from 'react';
import TokenManager from './components/TokenManager';

const TB_WS = 'wss://demo.thingsboard.io/api/ws';
const TB_HTTP = 'https://demo.thingsboard.io';

const LED_KEYS = ['led-p1', 'led-p2', 'led-v1', 'led-v2', 'led-v3', 'led-v4', 'led-v5'];
const compMap = {
  'led-p1': 'pump-p1',
  'led-p2': 'pump-p2',
  'led-v1': 'vsv-v1',
  'led-v2': 'vsv-v2',
  'led-v3': 'vsv-v3',
  'led-v4': 'vsv-v4',
  'led-v5': 'vsv-v5',
};

const initialDeviceState = Object.fromEntries(LED_KEYS.map((k) => [k, false]));

const FLUID_ROUTES = {
  FLUSH_WATER: {
    color: 'green',
    pipes: ['ph-center-l', 'ph-center-ft', 'ph-ft-right', 'ph-t3'],
    pipesV: ['pv-right-top'],
    elbows: [{ id: 'el-t3l', cls: 'e-green' }],
    leds: ['led-v5', 'led-v3'],
    blower: true,
    flowRate: () => (20 + Math.random() * 15).toFixed(1),
    oilRate: 0,
    waterRate: 8.5,
  },
  WATER: {
    color: 'blue',
    pipes: ['ph-t2-p2', 'ph-center-ft', 'ph-ft-right', 'ph-t3'],
    pipesV: ['pv-bot-center', 'pv-right-top'],
    elbows: [
      { id: 'el-t2r', cls: 'e-blue' },
      { id: 'el-t3l', cls: 'e-blue' },
    ],
    leds: ['led-p2', 'led-v2', 'led-v3'],
    blower: false,
    flowRate: () => (30 + Math.random() * 20).toFixed(1),
    oilRate: 0,
    waterRate: 12,
  },
  OIL: {
    color: 'orange',
    pipes: ['ph-t1-p1', 'ph-center-ft', 'ph-ft-right', 'ph-t4'],
    pipesV: ['pv-top-center', 'pv-right-bot'],
    elbows: [
      { id: 'el-t1r', cls: 'e-orange' },
      { id: 'el-t4l', cls: 'e-orange' },
    ],
    leds: ['led-p1', 'led-v1', 'led-v4'],
    blower: false,
    flowRate: () => (15 + Math.random() * 10).toFixed(1),
    oilRate: 6,
    waterRate: 0,
  },
  FLUSH_OIL: {
    color: 'green',
    pipes: ['ph-center-l', 'ph-center-ft', 'ph-ft-right', 'ph-t4'],
    pipesV: ['pv-right-bot'],
    elbows: [{ id: 'el-t4l', cls: 'e-green' }],
    leds: ['led-v5', 'led-v4'],
    blower: true,
    flowRate: () => (18 + Math.random() * 12).toFixed(1),
    oilRate: 4.5,
    waterRate: 0,
  },
};

const fluidNameMap = {
  FLUSH_WATER: 'FLUSH WATER',
  WATER: 'WATER',
  OIL: 'OIL',
  FLUSH_OIL: 'FLUSH OIL',
};

// Generate session ID unik per sesi START
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

export default function App() {
  const API_BASE = import.meta.env.DEV ? '' : 'https://scada-plc.vercel.app';

  const [activePage, setActivePage] = useState('main-page');
  const [logs, setLogs] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedFluidKey, setSelectedFluidKey] = useState(null);
  const [fluidName, setFluidName] = useState('---');
  const [flow, setFlow] = useState(0);
  const [oilLevel, setOilLevel] = useState('0.0');
  const [waterLevel, setWaterLevel] = useState('0.0');
  const [ledState, setLedState] = useState(initialDeviceState);
  const [blowerOn, setBlowerOn] = useState(false);
  const [routeClasses, setRouteClasses] = useState({ pipes: {}, pipesV: {}, elbows: {} });
  const [jwtToken, setJwtToken] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [deviceId, setDeviceId] = useState(null);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [frameScale, setFrameScale] = useState(1);

  // Refs untuk akses nilai terbaru di dalam interval/async tanpa stale closure
  const sessionIdRef = useRef(null);
  const ledStateRef = useRef(initialDeviceState);
  const blowerOnRef = useRef(false);
  const oilLevelRef = useRef('0.0');
  const waterLevelRef = useRef('0.0');
  const elapsedMinutesRef = useRef(0);
  const selectedFluidKeyRef = useRef(null);

  const wsRef = useRef(null);
  const intervalRef = useRef(null);

  const log = (msg, type = 'info') => {
    const ts = new Date().toLocaleTimeString('id-ID');
    setLogs((prev) => [...prev, { msg: `[${ts}] ${msg}`, type }]);
  };

  // ── Simpan telemetry ke MongoDB ──
  const saveTelemetryToDB = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/api/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      log(`⚠ DB save error: ${e.message}`, 'warn');
    }
  };

  const postTelemetry = (payload) => {
    if (!deviceToken) return;
    fetch(`${TB_HTTP}/api/v1/${deviceToken}/telemetry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'no-cors',
    })
      .then(() => log(`Sent: ${JSON.stringify(payload)}`, 'ok'))
      .catch((e) => log(`Send error: ${e.message}`, 'err'));
  };

  const clearVisualState = () => {
    setRouteClasses({ pipes: {}, pipesV: {}, elbows: {} });
    setBlowerOn(false);
    blowerOnRef.current = false;
    setLedState(initialDeviceState);
    ledStateRef.current = initialDeviceState;
  };

  const applyFluidRoute = (fluidKey) => {
    clearVisualState();
    if (!fluidKey || !FLUID_ROUTES[fluidKey]) return;
    const route = FLUID_ROUTES[fluidKey];
    const colorH = route.color === 'green' ? 'pipe-green' : route.color === 'blue' ? 'pipe-blue' : 'pipe-orange';
    const colorV = route.color === 'green' ? 'pipe-green-v' : route.color === 'blue' ? 'pipe-blue-v' : 'pipe-orange-v';

    const pipes = Object.fromEntries((route.pipes || []).map((id) => [id, colorH]));
    const pipesV = Object.fromEntries((route.pipesV || []).map((id) => [id, colorV]));
    const elbows = Object.fromEntries((route.elbows || []).map((e) => [e.id, e.cls]));

    setRouteClasses({ pipes, pipesV, elbows });
    setLedState((prev) => {
      const next = { ...initialDeviceState, ...prev };
      route.leds.forEach((id) => { next[id] = true; });
      ledStateRef.current = next;
      return next;
    });
    setBlowerOn(route.blower);
    blowerOnRef.current = route.blower;
  };

  const handleFluidSelect = (fluidKey) => {
    if (isRunning) {
      log('⚠ Stop sistem terlebih dahulu sebelum mengganti fluida!', 'warn');
      return;
    }
    setSelectedFluidKey(fluidKey);
    selectedFluidKeyRef.current = fluidKey;
    setFluidName(fluidNameMap[fluidKey] || fluidKey);
    log(`Fluida dipilih: ${fluidNameMap[fluidKey]}. Tekan START untuk mengaktifkan.`, 'warn');
  };

  const handleStart = () => {
    if (isRunning) { log('Sistem sudah berjalan.', 'warn'); return; }
    if (!selectedFluidKey) { log('⚠ Pilih fluida terlebih dahulu!', 'warn'); return; }

    const newSessionId = generateSessionId();
    sessionIdRef.current = newSessionId;
    elapsedMinutesRef.current = 0;
    oilLevelRef.current = '0.0';
    waterLevelRef.current = '0.0';

    setIsRunning(true);
    setElapsedMinutes(0);
    applyFluidRoute(selectedFluidKey);

    const route = FLUID_ROUTES[selectedFluidKey];
    const initFlow = route.flowRate();
    setFlow(parseFloat(initFlow));

    if (isOnline) {
      postTelemetry({
        system_command: 'startSystem',
        active_fluid: selectedFluidKey,
        flow_rate: parseFloat(initFlow),
        ...Object.fromEntries(LED_KEYS.map((k) => [k, ledStateRef.current[k]])),
      });
      log(`📡 TB ← START: fluid=${selectedFluidKey} flow=${initFlow}`, 'ok');
    }

    // Simpan event START ke MongoDB
    saveTelemetryToDB({
      session_id: newSessionId,
      active_fluid: selectedFluidKey,
      flow_rate: parseFloat(initFlow),
      oil_volume: 0,
      water_volume: 0,
      elapsed_minutes: 0,
      led_states: ledStateRef.current,
      blower: blowerOnRef.current,
      event_type: 'start',
    });
    log(`💾 DB ← Session START disimpan (${newSessionId})`, 'ok');
    log(`▶ Sistem START — Fluida: ${selectedFluidKey} | Flow: ${initFlow} L/min`, 'ok');

    intervalRef.current = setInterval(() => {
      elapsedMinutesRef.current += 1;
      const minutes = elapsedMinutesRef.current;
      const liveFlow = route.flowRate();
      const oilVal = (route.oilRate * minutes).toFixed(1);
      const wtrVal = (route.waterRate * minutes).toFixed(1);

      oilLevelRef.current = oilVal;
      waterLevelRef.current = wtrVal;

      setElapsedMinutes(minutes);
      setFlow(parseFloat(liveFlow));
      setOilLevel(oilVal);
      setWaterLevel(wtrVal);
      log(`⏱ Menit-${minutes}: Flow=${liveFlow} L/min | Oil=${oilVal}L | Water=${wtrVal}L`, 'ok');

      if (isOnline) {
        postTelemetry({
          flow_rate: parseFloat(liveFlow),
          oil_volume: parseFloat(oilVal),
          water_volume: parseFloat(wtrVal),
        });
        log(`📡 TB ← Volume update: oil=${oilVal}L water=${wtrVal}L flow=${liveFlow}`, 'ok');
      }

      // Simpan update periodik ke MongoDB
      saveTelemetryToDB({
        session_id: sessionIdRef.current,
        active_fluid: selectedFluidKeyRef.current,
        flow_rate: parseFloat(liveFlow),
        oil_volume: parseFloat(oilVal),
        water_volume: parseFloat(wtrVal),
        elapsed_minutes: minutes,
        led_states: ledStateRef.current,
        blower: blowerOnRef.current,
        event_type: 'update',
      });
      log(`💾 DB ← Menit-${minutes} disimpan`, 'ok');
    }, 60000);
  };

  const handleStop = () => {
    if (!isRunning && !selectedFluidKey) { log('Sistem sudah berhenti.', 'warn'); return; }

    setIsRunning(false);
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }

    // Simpan event STOP ke MongoDB sebelum reset
    if (sessionIdRef.current) {
      saveTelemetryToDB({
        session_id: sessionIdRef.current,
        active_fluid: selectedFluidKeyRef.current,
        flow_rate: 0,
        oil_volume: parseFloat(oilLevelRef.current),
        water_volume: parseFloat(waterLevelRef.current),
        elapsed_minutes: elapsedMinutesRef.current,
        led_states: ledStateRef.current,
        blower: false,
        event_type: 'stop',
      });
      log(`💾 DB ← Session STOP disimpan (durasi: ${elapsedMinutesRef.current} menit)`, 'warn');
      sessionIdRef.current = null;
    }

    clearVisualState();
    setFlow(0);
    setOilLevel('0.0');
    setWaterLevel('0.0');
    setElapsedMinutes(0);
    setSelectedFluidKey(null);
    selectedFluidKeyRef.current = null;
    setFluidName('---');
    elapsedMinutesRef.current = 0;
    oilLevelRef.current = '0.0';
    waterLevelRef.current = '0.0';

    if (isOnline) {
      postTelemetry({
        system_command: 'stopSystem',
        flow_rate: 0,
        oil_volume: 0,
        water_volume: 0,
        ...Object.fromEntries(LED_KEYS.map((k) => [k, false])),
      });
      log('📡 TB ← STOP telemetri dikirim (reset semua nilai).', 'warn');
    }

    log('■ Sistem STOP. Pilih fluida baru untuk memulai kembali.', 'warn');
  };

  const toggleDevice = (ledId) => {
    if (!isOnline || !isRunning) return;
    setLedState((prev) => {
      const next = { ...prev, [ledId]: !prev[ledId] };
      ledStateRef.current = next;
      postTelemetry({ [ledId]: next[ledId] });
      return next;
    });
  };

  const connectWS = (id, activeJwt) => {
    const token = activeJwt || jwtToken;
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

    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (!msg.data) return;
      Object.entries(msg.data).forEach(([key, val]) => {
        const v = Array.isArray(val) ? val[0][1] : val;
        if (LED_KEYS.includes(key)) {
          setLedState((prev) => {
            const next = { ...prev, [key]: v === true || v === 'true' };
            ledStateRef.current = next;
            return next;
          });
        }
        if (key === 'flow_rate') setFlow(parseFloat(v));
        if (key === 'active_fluid') setFluidName(String(v));
        if (key === 'oil_level') setOilLevel(parseFloat(v).toFixed(1));
        if (key === 'water_level') setWaterLevel(parseFloat(v).toFixed(1));
      });
    };

    ws.onclose = () => {
      setIsOnline(false);
      log('WS Closed', 'err');
    };
  };

  const doConnect = async (jwt, device) => {
    const activeJwt = jwt || jwtToken;
    const activeDevice = device || deviceToken;

    if (!activeJwt.trim() || !activeDevice.trim()) {
      alert('Token tidak valid!');
      return;
    }

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
      connectWS(id, activeJwt);
    } catch (e) {
      setIsOnline(false);
      log(e.message, 'err');
    }
  };

  const doDisconnect = () => {
    setIsOnline(false);
    if (wsRef.current) wsRef.current.close();
    log('Disconnected', 'err');
  };

  const autoScale = () => {
    const s = Math.min((window.innerWidth - 20) / 1100, (window.innerHeight - 20) / 720, 1);
    setFrameScale(s);
  };

  useEffect(() => {
    autoScale();
    log('Sistem Siap. Pilih fluida lalu tekan START.', 'info');
    window.addEventListener('resize', autoScale);
    return () => {
      window.removeEventListener('resize', autoScale);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const pageClass = (page) => `page ${activePage === page ? 'active' : ''}`;
  const statusText = isOnline ? 'ONLINE' : 'OFFLINE';

  const items = useMemo(
    () => [
      { type: 'tank', id: 't1', style: { top: 178, left: 98 }, text: 'T-01' },
      { type: 'tank', id: 't2', style: { top: 428, left: 98 }, text: 'T-02' },
      { type: 'tank', id: 't3', style: { top: 178, left: 878 }, text: 'T-03' },
      { type: 'tank', id: 't4', style: { top: 428, left: 878 }, text: 'T-04' },
    ],
    [],
  );

  return (
    <>
      <div id="scada-frame" style={{ transform: `scale(${frameScale})` }}>
        <div className="nav-bar">
          <button className={`nav-btn ${activePage === 'main-page' ? 'active' : ''}`} onClick={() => setActivePage('main-page')}>🖥️ SCADA VIEW</button>
          <button className={`nav-btn ${activePage === 'settings-page' ? 'active' : ''}`} onClick={() => setActivePage('settings-page')}>⚙️ SETTINGS & LOGS</button>
        </div>

        <div id="main-page" className={pageClass('main-page')}>
          <div className="header-area">
            <div className="main-header">
              Multi Fluid Transfer System<br />
              <span style={{ fontSize: 10, fontWeight: 'normal' }}>MINI SCADA BATCHING PIPELINE METHOD</span>
            </div>
            <div className="status-panel-new">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span id="conn-dot" className={isOnline ? 'online' : ''} />
                <b id="c-status" style={{ color: isOnline ? 'lime' : 'red', fontSize: 12 }}>{statusText}</b>
                <span id="sys-running-badge" className={isRunning ? 'running' : ''}>{isRunning ? '▶ RUNNING' : '■ IDLE'}</span>
                <span style={{ color: '#333', fontSize: 11, marginLeft: 5 }}>Fluida: <b id="fluid-name" style={{ color: '#d35400' }}>{fluidName}</b></span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button id="btn-start" className="small-btn start" onClick={handleStart}>▶ START</button>
                <button id="btn-stop" className="small-btn stop" onClick={handleStop}>■ STOP</button>
                <button className="small-btn auto" title="Fitur otomatis akan segera hadir!">⚙ AUTO</button>
              </div>
              <div style={{ fontSize: 11 }}>Oil: <span className="monitor-val" id="oil-lvl">{oilLevel}</span> Wtr: <span className="monitor-val" id="wtr-lvl">{waterLevel}</span></div>
            </div>
          </div>

          {items.map((it) => <div key={it.id} className="tank" id={it.id} style={it.style}>{it.text}</div>)}

          <div className={`pipe-h ${routeClasses.pipes['ph-t1-p1'] || ''}`} id="ph-t1-p1" style={{ top: 248, left: 218, width: 180 }} />
          <div className={`elbow elbow-tr ${routeClasses.elbows['el-t1r'] || ''}`} id="el-t1r" style={{ top: 248, left: 398 }} />
          <div className={`pipe-v ${routeClasses.pipesV['pv-top-center'] || ''}`} id="pv-top-center" style={{ top: 268, left: 398, height: 102 }} />
          <div className={`pipe-h ${routeClasses.pipes['ph-t2-p2'] || ''}`} id="ph-t2-p2" style={{ top: 498, left: 218, width: 180 }} />
          <div className={`elbow elbow-br ${routeClasses.elbows['el-t2r'] || ''}`} id="el-t2r" style={{ top: 498, left: 398 }} />
          <div className={`pipe-v ${routeClasses.pipesV['pv-bot-center'] || ''}`} id="pv-bot-center" style={{ top: 370, left: 398, height: 128 }} />
          <div className={`pipe-h ${routeClasses.pipes['ph-center-l'] || ''}`} id="ph-center-l" style={{ top: 370, left: 163, width: 235 }} />
          <div className={`pipe-h ${routeClasses.pipes['ph-center-ft'] || ''}`} id="ph-center-ft" style={{ top: 370, left: 418, width: 90 }} />
          <div className={`pipe-v ${routeClasses.pipesV['pv-right-top'] || ''}`} id="pv-right-top" style={{ top: 268, left: 650, height: 102 }} />
          <div className={`pipe-v ${routeClasses.pipesV['pv-right-bot'] || ''}`} id="pv-right-bot" style={{ top: 390, left: 650, height: 108 }} />
          <div style={{ position: 'absolute', top: 370, left: 650, width: 20, height: 20, background: '#bbb', zIndex: 3, borderLeft: '1px solid #555', borderRight: '1px solid #555' }} />
          <div className={`elbow elbow-tl ${routeClasses.elbows['el-t3l'] || ''}`} id="el-t3l" style={{ top: 248, left: 650 }} />
          <div className={`pipe-h ${routeClasses.pipes['ph-t3'] || ''}`} id="ph-t3" style={{ top: 248, left: 670, width: 208 }} />
          <div className={`elbow elbow-bl ${routeClasses.elbows['el-t4l'] || ''}`} id="el-t4l" style={{ top: 498, left: 650 }} />
          <div className={`pipe-h ${routeClasses.pipes['ph-t4'] || ''}`} id="ph-t4" style={{ top: 498, left: 670, width: 208 }} />
          <div className={`pipe-h ${routeClasses.pipes['ph-ft-right'] || ''}`} id="ph-ft-right" style={{ top: 370, left: 600, width: 50 }} />

          <div className="comp-label" style={{ top: 332, left: 20 }}>[AIR BLOWER]</div>
          <div id="air-blower-box">
            <div style={{ color: '#ccc', fontSize: 8, fontWeight: 'bold' }}>BLW</div>
            <div id="led-blower" className={blowerOn ? 'on' : ''} />
          </div>

          <div className={`pump ${ledState['led-p1'] ? 'active' : ''}`} id="pump-p1" style={{ top: 231, left: 256 }} onClick={() => toggleDevice('led-p1')} />
          <div className={`led ${ledState['led-p1'] ? 'on' : ''}`} id="led-p1" style={{ top: 287, left: 271 }} />
          <div className="comp-label" style={{ top: 220, left: 255 }}>P1</div>

          <div className={`pump ${ledState['led-p2'] ? 'active' : ''}`} id="pump-p2" style={{ top: 481, left: 256 }} onClick={() => toggleDevice('led-p2')} />
          <div className={`led ${ledState['led-p2'] ? 'on' : ''}`} id="led-p2" style={{ top: 537, left: 271 }} />
          <div className="comp-label" style={{ top: 470, left: 255 }}>P2</div>

          {['v1', 'v2', 'v5', 'v3', 'v4'].map((v, idx) => {
            const pos = [
              { top: 223, left: 337, ledTop: 267, ledLeft: 345, labelTop: 213, labelLeft: 340 },
              { top: 473, left: 337, ledTop: 517, ledLeft: 345, labelTop: 463, labelLeft: 340 },
              { top: 345, left: 225, ledTop: 389, ledLeft: 233, labelTop: 335, labelLeft: 228 },
              { top: 223, left: 715, ledTop: 267, ledLeft: 723, labelTop: 213, labelLeft: 718 },
              { top: 473, left: 715, ledTop: 517, ledLeft: 723, labelTop: 463, labelLeft: 718 },
            ][idx];
            const ledId = `led-${v}`;
            return (
              <div key={v}>
                <svg className={`valve-svg ${ledState[ledId] ? 'active' : ''}`} id={`vsv-${v}`} style={{ top: pos.top, left: pos.left }} viewBox="0 0 20 20" onClick={() => toggleDevice(ledId)}>
                  <polygon points="0,5 20,15 0,15 20,5" fill="white" stroke="black" strokeWidth="1.5" />
                </svg>
                <div className={`led ${ledState[ledId] ? 'on' : ''}`} id={ledId} style={{ top: pos.ledTop, left: pos.ledLeft }} />
                <div className="comp-label" style={{ top: pos.labelTop, left: pos.labelLeft }}>{v.toUpperCase()}</div>
              </div>
            );
          })}

          <div id="ft-display">FT: {Number.isFinite(flow) ? flow.toFixed(1) : '0.0'}</div>
          <div className="comp-label" style={{ top: 403, left: 501, color: '#fff' }}>L/min</div>

          <div className="footer-btns">
            <button className={`btn-ctrl ${selectedFluidKey === 'FLUSH_WATER' ? 'selected' : ''}`} id="btn-flush-water" style={{ background: 'var(--active-blue)' }} onClick={() => handleFluidSelect('FLUSH_WATER')}>💧 Flush Water</button>
            <button className={`btn-ctrl ${selectedFluidKey === 'WATER' ? 'selected' : ''}`} id="btn-water" style={{ background: '#1a6bb5' }} onClick={() => handleFluidSelect('WATER')}>🌊 Water</button>
            <button className={`btn-ctrl ${selectedFluidKey === 'OIL' ? 'selected' : ''}`} id="btn-oil" style={{ background: 'var(--active-yellow)', color: '#000' }} onClick={() => handleFluidSelect('OIL')}>🛢 Oil</button>
            <button className={`btn-ctrl ${selectedFluidKey === 'FLUSH_OIL' ? 'selected' : ''}`} id="btn-flush-oil" style={{ background: 'var(--active-orange)' }} onClick={() => handleFluidSelect('FLUSH_OIL')}>🔥 Flush Oil</button>
          </div>
        </div>

        <div id="settings-page" className={pageClass('settings-page')}>
          <div className="settings-grid">
            <div className="config-box">
              <TokenManager
                apiBase={API_BASE}
                onConnect={(jwt, device) => doConnect(jwt, device)}
                onDisconnect={doDisconnect}
                isOnline={isOnline}
              />
            </div>
            <div className="log-container">
              <div className="log-header">
                <span>SYSTEM ACTIVITY LOG</span>
                <button className="btn-clear-log" onClick={() => { setLogs([]); log('Log dibersihkan.', 'warn'); }}>Clear Log</button>
              </div>
              <div id="log-panel">
                {logs.map((l, i) => <div key={`${l.msg}-${i}`} className={`log-${l.type}`}>{l.msg}</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}