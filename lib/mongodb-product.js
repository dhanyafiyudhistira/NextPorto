import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_PRODUCT_URI;
const dbName = process.env.MONGODB_PRODUCT_DB ?? 'catalog_product';

if (!uri) {
  throw new Error('Missing MONGODB_PRODUCT_URI environment variable');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._productMongoClientPromise) {
    client = new MongoClient(uri);
    global._productMongoClientPromise = client.connect();
  }
  clientPromise = global._productMongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getProductDb() {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export async function getProductCollection() {
  const db = await getProductDb();
  return db.collection('products');
}
