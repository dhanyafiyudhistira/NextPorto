import { MongoClient } from 'mongodb';

const dbName = process.env.MONGODB_AUTH_DB || 'auth';

let clientPromise;

function getClientPromise() {
  const uri = process.env.MONGODB_AUTH_URI;

  if (!uri) {
    throw new Error('MONGODB_AUTH_URI is missing. Set it in .env.local or your deployment environment.');
  }

  if (clientPromise) {
    return clientPromise;
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoAuthClientPromise) {
      const client = new MongoClient(uri);
      global._mongoAuthClientPromise = client.connect();
    }

    clientPromise = global._mongoAuthClientPromise;
    return clientPromise;
  }

  const client = new MongoClient(uri);
  clientPromise = client.connect();
  return clientPromise;
}

export async function getAuthDb() {
  const mongoClient = await getClientPromise();
  return mongoClient.db(dbName);
}
