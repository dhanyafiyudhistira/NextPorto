import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_AUTH_URI;
const dbName = process.env.MONGODB_AUTH_DB || 'auth';

if (!uri) {
  throw new Error('Please add MONGODB_AUTH_URI to your environment variables');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoAuthClientPromise) {
    client = new MongoClient(uri);
    global._mongoAuthClientPromise = client.connect();
  }
  clientPromise = global._mongoAuthClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getAuthDb() {
  const mongoClient = await clientPromise;
  return mongoClient.db(dbName);
}
