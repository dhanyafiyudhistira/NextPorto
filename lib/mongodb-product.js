import { MongoClient } from 'mongodb';

const dbName = process.env.MONGODB_PRODUCT_DB || 'catalog';

let clientPromise;

function getClientPromise() {
  const uri = process.env.MONGODB_PRODUCT_URI;

  if (!uri) {
    throw new Error('MONGODB_PRODUCT_URI is missing. Set it in .env.local or your deployment environment.');
  }

  if (clientPromise) {
    return clientPromise;
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoProductClientPromise) {
      const client = new MongoClient(uri);
      global._mongoProductClientPromise = client.connect();
    }

    clientPromise = global._mongoProductClientPromise;
    return clientPromise;
  }

  const client = new MongoClient(uri);
  clientPromise = client.connect();
  return clientPromise;
}

export async function getProductDb() {
  const mongoClient = await getClientPromise();
  return mongoClient.db(dbName);
}
