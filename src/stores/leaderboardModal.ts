import { writable } from 'svelte/store';

export const isLeaderboardOpen = writable(false);
export const leaderboardExpandTick = writable(0);

export const openLeaderboard = () => isLeaderboardOpen.set(true);
export const closeLeaderboard = () => isLeaderboardOpen.set(false);
export const expandPageLeaderboard = () => leaderboardExpandTick.update((tick) => tick + 1);
