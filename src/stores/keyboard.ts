import { writable } from 'svelte/store';

export const isKeyboardVisible = writable<boolean>(false);

export const showKeyboard = () => isKeyboardVisible.set(true);
export const hideKeyboard = () => isKeyboardVisible.set(false);
