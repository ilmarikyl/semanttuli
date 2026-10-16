import { writable } from 'svelte/store';

export type LeaderboardDay = 'today' | 'yesterday';

export const isLeaderboardOpen = writable(false);
export const leaderboardDay = writable<LeaderboardDay>('today');

export const openLeaderboard = (day: LeaderboardDay = 'today') => {
	leaderboardDay.set(day);
	isLeaderboardOpen.set(true);
};

export const closeLeaderboard = () => isLeaderboardOpen.set(false);
