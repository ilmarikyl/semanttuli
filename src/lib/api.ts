// src/lib/api.ts
import {
	getW2VCollection,
	getNearbyCollection,
	getSimilarityRangeCollection
} from './services/dbService';
import type { ModelResult } from './types';
import { decodeB64word } from './utils/utils';

export async function getModel(b64secret: string, word: string) {
	const w2v = await getW2VCollection();
	const nearbyCollection = await getNearbyCollection();
	const decodedSecret = decodeB64word(b64secret);
	const noVecResult = await nearbyCollection.findOne({ word: decodedSecret, neighbor: word });
	const resultObj: ModelResult = noVecResult || {};
	const vecResult = await w2v.findOne({ word });

	if (!vecResult || !vecResult.vec) {
		return null;
	}

	const base64 = vecResult.vec.toString('base64');
	const buffer = Buffer.from(base64, 'base64');
	const float32Vector = new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4);

	const stringVector = Array.from(float32Vector).map(String);

	resultObj['vec'] = stringVector;

	return resultObj;
}

export async function getWordVector(word: string) {
	const w2v = await getW2VCollection();
	const vecResult = await w2v.findOne({ word });

	if (!vecResult || !vecResult.vec) {
		return null;
	}

	const base64 = vecResult.vec.toString('base64');
	const buffer = Buffer.from(base64, 'base64');
	const float32Vector = new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4);
	const stringVector = Array.from(float32Vector).map(String);

	return stringVector;
}

export async function getHint(secret: string, percentile: number) {
	const nearbyCollection = await getNearbyCollection();
	const decodedSecret = decodeB64word(secret);

	return nearbyCollection.findOne({ word: decodedSecret, percentile });
}

export async function getSimilarity(wordB64: string) {
	const similarityRange = await getSimilarityRangeCollection();
	const word = decodeB64word(wordB64);
	const result = await similarityRange.findOne({ word });

	if (!result) {
		return null;
	}

	return {
		top: result.top,
		top10: result.top10,
		top1000: result.rest
	};
}

// skip first one
export async function getNearby10(wordB64: string) {
	const nearbyCollection = await getNearbyCollection();
	const word = decodeB64word(wordB64);
	return nearbyCollection
		.find({ word }, { projection: { neighbor: 1 } })
		.sort({ percentile: -1 })
		.skip(1)
		.limit(10)
		.toArray();
}

export async function getNearby1k(wordB64: string) {
	const nearbyCollection = await getNearbyCollection();
	const word = decodeB64word(wordB64);

	return nearbyCollection
		.find({ word }, { projection: { neighbor: 1, percentile: 1, similarity: 1 } })
		.sort({ percentile: -1 })
		.limit(1000)
		.toArray();
}
