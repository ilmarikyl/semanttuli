import { writable } from 'svelte/store';
import type { GameStats } from '$lib/types';
import { createInitialStats } from '$lib/utils/stats';
import { getGameNumber } from '$lib/utils/utils';
import { getLocalStorage } from '$lib/utils/localStorage';

export const statsStore = writable<GameStats>(createInitialStats(getGameNumber()));

export function updateStatsStore(newStats: GameStats) {
	statsStore.set(newStats);

	const storage = getLocalStorage();
	if (storage) {
		storage.setItem('stats', JSON.stringify(newStats));
	}
}

export function updateStat(stat: keyof GameStats, value: number | 'increment' = 'increment', incrementBy: number = 1) {
	statsStore.update((stats) => {
		if (value === 'increment') {
			stats[stat] += incrementBy;
		} else {
			stats[stat] = value;
		}

		const storage = getLocalStorage();
		if (storage) {
			storage.setItem('stats', JSON.stringify(stats));
		}
		return stats;
	});
}
