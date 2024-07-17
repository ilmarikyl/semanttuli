import { MongoClient, Db, Collection } from 'mongodb';
import { config } from 'dotenv';
import type { Document, WithId } from 'mongodb';

config();

const uri = process.env.MONGO_CONNECTION_STRING;
const dbName = process.env.DB_NAME;

if (!uri || !dbName) {
	throw new Error('MONGO_CONNECTION_STRING or DB_NAME is not defined in the environment');
}

// Singleton MongoClient instance
let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDB(): Promise<Db> {
	if (!client) {
		if (typeof uri !== 'string') {
			throw new Error('MONGO_CONNECTION_STRING must be a string');
		}
		client = new MongoClient(uri);
	}

	if (!db) {
		try {
			await client.connect();
			db = client.db(dbName);
		} catch (error) {
			console.error('MongoDB connection error:', error);
			throw error; // Re-throw the error after logging
		}
	}

	return db;
}

// Helper function to get collections
async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
	const db = await connectDB();
	return db.collection<T>(name);
}

// Export collection getters
export async function getW2VCollection(): Promise<
	Collection<WithId<{ word: string; vec: Buffer }>>
> {
	return getCollection('word2vec');
}

export async function getNearbyCollection(): Promise<
	Collection<WithId<{ word: string; neighbor: string; percentile: number; similarity: number }>>
> {
	return getCollection('nearby');
}

export async function getSimilarityRangeCollection(): Promise<
	Collection<WithId<{ word: string; top: number; top10: number; rest: number }>>
> {
	return getCollection('similarity_range');
}
