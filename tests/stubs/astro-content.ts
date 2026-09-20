/**
 * `astro:content` is a virtual module that only exists inside Astro's build.
 * Vitest can't resolve it, which used to make the whole suite fail on import.
 * The pure helpers in src/lib are what we test; they never call these.
 */
export const getCollection = async () => [];
export const getEntry = async () => undefined;
export const render = async () => ({ Content: null });
export type CollectionEntry<T = unknown> = {
  collection: string;
  id: string;
  filePath?: string;
  data: Record<string, unknown>;
  body?: string;
};
