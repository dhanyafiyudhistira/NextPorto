import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_AUTH_URI;
const dbName = process.env.MONGODB_AUTH_DB ?? 'catalog_auth';

if (!uri) {
  throw new Error('Missing MONGODB_AUTH_URI environment variable');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._authMongoClientPromise) {
    client = new MongoClient(uri);
    global._authMongoClientPromise = client.connect();
  }
  clientPromise = global._authMongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getAuthDb() {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export async function getUserCollection() {
  const db = await getAuthDb();
  return db.collection('users');
}
