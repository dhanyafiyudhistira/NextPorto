import { useEffect, useMemo, useState } from 'react'

const tabs = ['HOME', 'MONITORING', 'SETTING', 'TREND', 'ALARM']

const trendSeed = Array.from({ length: 24 }, (_, i) => ({
  t: `${String(i).padStart(2, '0')}:00`,
  level: 45 + Math.round(Math.sin(i / 3) * 18 + Math.random() * 6),
  flow: 24 + Math.round(Math.cos(i / 4) * 8 + Math.random() * 4),
  ph: Number((7 + Math.sin(i / 5) * 0.7).toFixed(2))
}))

function StatusLamp({ label, active }) {
  return (
    <div className="status-lamp">
      <span className={`lamp ${active ? 'on' : 'off'}`} />
      <span>{label}</span>
    </div>
  )
}

function Chart({ data, keyName, color, min, max }) {
  const points = useMemo(() => {
    const h = 130
    const w = 440
    const step = w / (data.length - 1)
    return data
      .map((d, i) => {
        const x = i * step
        const ratio = (d[keyName] - min) / (max - min || 1)
        const y = h - ratio * h
        return `${x},${Math.max(8, Math.min(h - 8, y))}`
      })
      .join(' ')
  }, [data, keyName, min, max])

  return (
    <svg viewBox="0 0 460 140" className="mini-chart" role="img" aria-label={`${keyName} chart`}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="3" />
    </svg>
  )
}

function ScadaSvgPlaceholder() {
  const defaultScadaSvg = `
    <svg class="scada-svg-placeholder" viewBox="0 0 1200 420" role="img" aria-label="Placeholder SVG skema SCADA" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#78b7ff" />
        </marker>
      </defs>

      <rect x="20" y="20" width="1160" height="380" rx="12" fill="#1d2430" stroke="#3e4d63" stroke-width="2" />

      <rect x="80" y="140" width="220" height="130" rx="8" fill="#2d5b8f" stroke="#8ac2ff" />
      <text x="190" y="205" text-anchor="middle" fill="#fff" font-size="20" font-weight="700">RAW WATER</text>

      <rect x="470" y="140" width="260" height="130" rx="8" fill="#3a6f4d" stroke="#97e9af" />
      <text x="600" y="205" text-anchor="middle" fill="#fff" font-size="20" font-weight="700">WTP PROCESS</text>

      <rect x="900" y="140" width="220" height="130" rx="8" fill="#6c4b84" stroke="#d2a8f2" />
      <text x="1010" y="205" text-anchor="middle" fill="#fff" font-size="20" font-weight="700">CLEAN TANK</text>

      <line x1="300" y1="205" x2="470" y2="205" stroke="#78b7ff" stroke-width="6" marker-end="url(#arrow)" />
      <line x1="730" y1="205" x2="900" y2="205" stroke="#78b7ff" stroke-width="6" marker-end="url(#arrow)" />

      <text x="600" y="348" text-anchor="middle" fill="#9fb6d6" font-size="16">
        Ganti SVG ini dengan skema SCADA asli Anda (paste elemen &lt;g&gt;/&lt;path&gt;/&lt;text&gt; dari desain proses)
      </text>
    </svg>
  `

  return (
    <section className="card scada-placeholder-wrap">
      <div className="placeholder-head">
        <h3>Area Skema SCADA (SVG)</h3>
        <span>Bisa paste RAW SVG langsung (termasuk atribut style string)</span>
      </div>
      <div dangerouslySetInnerHTML={{ __html: defaultScadaSvg }} />
    </section>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('HOME')
  const [now, setNow] = useState(new Date())
  const [showExitModal, setShowExitModal] = useState(false)
  const [filter, setFilter] = useState('24h')

  const [settings, setSettings] = useState({
    intakePump: 'AUTO',
    transferPump: 'AUTO',
    dosingPump: 'MANUAL',
    lowLevel: 30,
    highLevel: 85,
    phSetpoint: 7.2,
    dosingSetpoint: 52,
    interPumpDelay: 8,
    backwashDuration: 14,
    levelOffset: 0,
    flowOffset: 0,
    phOffset: 0
  })

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const dateText = now.toISOString().slice(0, 10)
  const timeText = now.toTimeString().slice(0, 8)

  const filteredData = useMemo(() => {
    if (filter === '1h') return trendSeed.slice(-6)
    if (filter === 'custom') return trendSeed.slice(8, 20)
    return trendSeed
  }, [filter])

  return (
    <div className="shell">
      <header className="top-header">
        <div className="header-left-design" />
        <div className="header-title">Sistem Pengolahan Air Bersih</div>
        <div className="header-info-box">
          <div className="info-row"><span>Time :</span><span>{timeText}</span></div>
          <div className="info-row"><span>Date :</span><span>{dateText}</span></div>
        </div>
      </header>

      <div className="main-layout">
        <main className="content-area">
          {activeTab === 'HOME' && (
            <section className="grid-home">
              <article className="card">
                <h3>Overview Status Plant</h3>
                <div className="lamp-group">
                  <StatusLamp label="Running" active />
                  <StatusLamp label="Stopped" active={false} />
                  <StatusLamp label="Fault" active={false} />
                </div>
              </article>

              <article className="card">
                <h3>Key Performance Indicators</h3>
                <div className="kpi-list">
                  <div><strong>1,284 m³</strong><span>Total produksi hari ini</span></div>
                  <div><strong>186.4 jam</strong><span>Running hours pompa utama</span></div>
                  <div><strong>97.8%</strong><span>Availability plant</span></div>
                </div>
              </article>

              <article className="card full">
                <h3>Topologi Ringkas</h3>
                <div className="topology">
                  <span>Raw Water</span><span>→</span><span>Proses Pengolahan</span><span>→</span><span>Clean Water Tank</span>
                </div>
                <p className="operator">Logged in as: Operator 1</p>
              </article>

              <div className="full">
                <ScadaSvgPlaceholder />
              </div>
            </section>
          )}

          {activeTab === 'MONITORING' && (
            <section className="card">
              <h3>Monitoring Real-Time</h3>
              <div className="kpi-list">
                <div><strong>Level Tangki: 68%</strong><span>Status normal</span></div>
                <div><strong>Laju Aliran: 26 L/s</strong><span>Inlet line A</span></div>
                <div><strong>pH Outlet: 7.18</strong><span>Dalam rentang target</span></div>
              </div>
            </section>
          )}

          {activeTab === 'SETTING' && (
            <section className="settings-grid">
              <article className="card">
                <h3>Control Mode Toggle</h3>
                {['intakePump', 'transferPump', 'dosingPump'].map((key) => (
                  <label key={key} className="setting-row">
                    <span>{key}</span>
                    <select value={settings[key]} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}>
                      <option>AUTO</option>
                      <option>MANUAL</option>
                    </select>
                  </label>
                ))}
              </article>

              <article className="card">
                <h3>Setpoints (Batas Nilai)</h3>
                {[
                  ['lowLevel', 'Low Level (%)'],
                  ['highLevel', 'High Level (%)'],
                  ['phSetpoint', 'Target pH'],
                  ['dosingSetpoint', 'Dosing Pump (ml/min)']
                ].map(([key, label]) => (
                  <label key={key} className="setting-row">
                    <span>{label}</span>
                    <input type="number" step="0.1" value={settings[key]} onChange={(e) => setSettings({ ...settings, [key]: Number(e.target.value) })} />
                  </label>
                ))}
              </article>

              <article className="card">
                <h3>Timer & Delay</h3>
                <label className="setting-row"><span>Inter-pump delay (s)</span><input type="number" value={settings.interPumpDelay} onChange={(e) => setSettings({ ...settings, interPumpDelay: Number(e.target.value) })} /></label>
                <label className="setting-row"><span>Backwash duration (min)</span><input type="number" value={settings.backwashDuration} onChange={(e) => setSettings({ ...settings, backwashDuration: Number(e.target.value) })} /></label>
              </article>

              <article className="card">
                <h3>Kalibrasi Sensor (Offset)</h3>
                <label className="setting-row"><span>Level offset</span><input type="number" value={settings.levelOffset} onChange={(e) => setSettings({ ...settings, levelOffset: Number(e.target.value) })} /></label>
                <label className="setting-row"><span>Flow offset</span><input type="number" value={settings.flowOffset} onChange={(e) => setSettings({ ...settings, flowOffset: Number(e.target.value) })} /></label>
                <label className="setting-row"><span>pH offset</span><input type="number" step="0.01" value={settings.phOffset} onChange={(e) => setSettings({ ...settings, phOffset: Number(e.target.value) })} /></label>
              </article>
            </section>
          )}

          {activeTab === 'TREND' && (
            <section className="card trend-card">
              <div className="trend-head">
                <h3>Trend Historis</h3>
                <div className="trend-tools">
                  <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="1h">1 Jam Terakhir</option>
                    <option value="24h">24 Jam Terakhir</option>
                    <option value="custom">Tanggal Kustom</option>
                  </select>
                  <button>Export CSV</button>
                  <button>Export Excel</button>
                </div>
              </div>
              <div className="trend-grid">
                <div><h4>Level Air (%)</h4><Chart data={filteredData} keyName="level" color="#50d070" min={20} max={100} /></div>
                <div><h4>Laju Aliran (L/s)</h4><Chart data={filteredData} keyName="flow" color="#f0c040" min={10} max={40} /></div>
                <div><h4>pH</h4><Chart data={filteredData} keyName="ph" color="#4aa3ff" min={5} max={9} /></div>
              </div>
            </section>
          )}

          {activeTab === 'ALARM' && (
            <section className="card">
              <h3>Alarm Ringkas</h3>
              <p>Tidak ada alarm aktif.</p>
            </section>
          )}
        </main>

        <aside className="sidebar-right">
          <div className="panel-label">PANEL CONTROL</div>
          {tabs.map((tab) => (
            <button key={tab} className={`menu-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
          <button className="menu-btn exit" onClick={() => setShowExitModal(true)}>EXIT</button>
        </aside>
      </div>

      {showExitModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Konfirmasi Keluar</h3>
            <p>Apakah Anda yakin ingin logout dari sistem?</p>
            <div className="modal-actions">
              <button onClick={() => setShowExitModal(false)}>Batal</button>
              <button onClick={() => setShowExitModal(false)}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
