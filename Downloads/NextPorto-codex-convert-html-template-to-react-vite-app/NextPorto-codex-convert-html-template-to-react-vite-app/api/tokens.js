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
    const col = db.collection('tokens');

    // GET /api/tokens — ambil semua token
    if (req.method === 'GET') {
      const tokens = await col.find({}, { projection: { _id: 1, label: 1, jwtToken: 1, deviceToken: 1, createdAt: 1 } }).sort({ createdAt: -1 }).toArray();
      // Mask JWT token untuk keamanan di list (hanya tampilkan prefix)
      const masked = tokens.map(t => ({
        ...t,
        jwtPreview: t.jwtToken ? t.jwtToken.substring(0, 20) + '...' : '',
        devicePreview: t.deviceToken ? t.deviceToken.substring(0, 10) + '...' : '',
      }));
      return res.status(200).json({ success: true, data: masked });
    }

    // POST /api/tokens — simpan token baru
    if (req.method === 'POST') {
      const { label, jwtToken, deviceToken } = req.body;
      if (!label || !jwtToken || !deviceToken) {
        return res.status(400).json({ success: false, message: 'label, jwtToken, dan deviceToken wajib diisi.' });
      }
      const doc = { label, jwtToken, deviceToken, createdAt: new Date() };
      const result = await col.insertOne(doc);
      return res.status(201).json({ success: true, id: result.insertedId, message: 'Token berhasil disimpan.' });
    }

    // DELETE /api/tokens?id=xxx — hapus token
    if (req.method === 'DELETE') {
      const { ObjectId } = await import('mongodb');
      const { id } = req.query;
      if (!id) return res.status(400).json({ success: false, message: 'ID diperlukan.' });
      await col.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true, message: 'Token dihapus.' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
}
