/**
 * Calculates the dot product of two vectors.
 * @param {number[]} f1 - First vector
 * @param {number[]} f2 - Second vector
 * @returns {number} - The dot product
 */
function dot(f1: number[], f2: number[]): number {
	return f1.reduce((acc, curr, i) => acc + curr * f2[i], 0);
}

/**
 * Calculates the magnitude of a vector.
 * @param {number[]} f - Vector
 * @returns {number} - The magnitude of the vector
 */
function mag(f: number[]): number {
	return Math.sqrt(f.reduce((acc, curr) => acc + curr * curr, 0));
}

/**
 * Calculates the cosine similarity between two vectors.
 * @param {number[]} f1 - First vector
 * @param {number[]} f2 - Second vector
 * @returns {number} - The cosine similarity
 */
export function getCosSim(f1: number[], f2: number[]): number {
	return dot(f1, f2) / (mag(f1) * mag(f2));
}
