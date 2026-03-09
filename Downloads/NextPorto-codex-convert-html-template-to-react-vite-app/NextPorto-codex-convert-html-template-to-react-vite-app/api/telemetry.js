import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function getClient() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const client = await getClient();
    const db = client.db('scada_db');
    const col = db.collection('telemetry');

    // GET /api/telemetry?limit=50&fluid=OIL — ambil riwayat telemetry
    if (req.method === 'GET') {
      const limit = parseInt(req.query.limit) || 50;
      const filter = {};
      if (req.query.fluid) filter.active_fluid = req.query.fluid;
      if (req.query.session_id) filter.session_id = req.query.session_id;

      const data = await col
        .find(filter)
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();

      return res.status(200).json({ success: true, count: data.length, data });
    }

    // POST /api/telemetry — simpan satu record telemetry
    if (req.method === 'POST') {
      const {
        session_id,
        active_fluid,
        flow_rate,
        oil_volume,
        water_volume,
        elapsed_minutes,
        led_states,
        blower,
        event_type, // 'start' | 'update' | 'stop'
      } = req.body;

      if (!session_id || !event_type) {
        return res.status(400).json({ success: false, message: 'session_id dan event_type wajib diisi.' });
      }

      const doc = {
        session_id,
        active_fluid: active_fluid || null,
        flow_rate: flow_rate ?? null,
        oil_volume: oil_volume ?? null,
        water_volume: water_volume ?? null,
        elapsed_minutes: elapsed_minutes ?? 0,
        led_states: led_states || {},
        blower: blower ?? false,
        event_type,
        timestamp: new Date(),
      };

      const result = await col.insertOne(doc);
      return res.status(201).json({ success: true, id: result.insertedId });
    }

    // DELETE /api/telemetry?session_id=xxx — hapus semua record satu sesi
    if (req.method === 'DELETE') {
      const { session_id } = req.query;
      if (!session_id) return res.status(400).json({ success: false, message: 'session_id diperlukan.' });
      const result = await col.deleteMany({ session_id });
      return res.status(200).json({ success: true, deleted: result.deletedCount });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
}