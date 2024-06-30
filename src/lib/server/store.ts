import type { SelectChatSchema } from '$drizzle/schema';
import { writable } from 'svelte/store';

export const buffer = writable<SelectChatSchema[]>([]);
