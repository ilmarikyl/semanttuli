import { currentConfig } from '$lib/config/language';
import { type Document, type WithId, MongoClient, Db, Collection } from 'mongodb';
import { config } from 'dotenv';

config();

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDB(): Promise<Db> {
	if (!client) {
		const uri = process.env.MONGO_CONNECTION_STRING;
		if (!uri) {
			throw new Error('MONGO_CONNECTION_STRING is not defined');
		}
		client = new MongoClient(uri);
	}

	if (!db) {
		try {
			await client.connect();
			db = client.db(currentConfig.dbName);
			console.log('Connected to MongoDB database:', currentConfig.dbName);
		} catch (error) {
			console.error('MongoDB connection error:', error);
			throw error;
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
export async function getW2VCollection(): Promise<Collection<WithId<{ word: string; vec: Buffer }>>> {
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
