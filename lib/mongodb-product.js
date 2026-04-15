import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_PRODUCT_URI;
const dbName = process.env.MONGODB_PRODUCT_DB || 'catalog';

if (!uri) {
  throw new Error('Please add MONGODB_PRODUCT_URI to your environment variables');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoProductClientPromise) {
    client = new MongoClient(uri);
    global._mongoProductClientPromise = client.connect();
  }
  clientPromise = global._mongoProductClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getProductDb() {
  const mongoClient = await clientPromise;
  return mongoClient.db(dbName);
}
