import { type CollectionEntry, getCollection } from "astro:content";
import { FEATURED_POSTS_LIMIT } from "../constants";
import readingTime from "reading-time";

export type BlogCategory = "learn" | "share" | "journey";
export type BlogPost = CollectionEntry<"learn" | "share" | "journey">;

export const BLOG_CATEGORIES: BlogCategory[] = ["learn", "share", "journey"];

export const COLLECTION_LABELS: Record<string, string> = {
  learn: "Learn",
  share: "Share",
  journey: "Journey",
  notes: "Notes",
};

export async function getAllPosts(
  category?: BlogCategory,
): Promise<BlogPost[]> {
  const collections = category
    ? [await getCollection(category)]
    : await Promise.all(BLOG_CATEGORIES.map((c) => getCollection(c)));

  const posts = collections
    .flat()
    .filter((post) => !post.data.draft)
    .sort(
      (a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime(),
    );

  return posts;
}

export async function getFeaturedPosts(
  limit = FEATURED_POSTS_LIMIT,
): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.data.featured).slice(0, limit);
}

/**
 * Lenses that actually have published posts. Drives the Writing filter bar so
 * we never link readers into an empty room.
 */
export async function getPopulatedCategories(): Promise<BlogCategory[]> {
  const counts = await Promise.all(
    BLOG_CATEGORIES.map(async (c) => [c, (await getAllPosts(c)).length] as const),
  );
  return counts.filter(([, n]) => n > 0).map(([c]) => c);
}

export function getReadingTime(content: string): string {
  return readingTime(content).text;
}

/**
 * Single source of truth for a post's slug. `getStaticPaths()` and every link
 * builder must go through this — deriving it independently is how `.mdx` posts
 * used to build at one path and get linked at another.
 */
export function getPostSlug(post: { filePath?: string; id?: string }): string {
  const source = post.filePath ?? post.id ?? "";
  const filename = source.split("/").pop() ?? "";
  return filename.replace(/\.(md|mdx)$/, "");
}

export function getPostUrl(post: BlogPost): string {
  return `/${post.collection}/${getPostSlug(post)}`;
}

export type Note = CollectionEntry<"notes">;

export async function getAllNotes(): Promise<Note[]> {
  const notes = await getCollection("notes");
  return notes
    .filter((note) => !note.data.draft)
    .sort(
      (a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime(),
    );
}

export function getNoteUrl(note: Note): string {
  return `/notes/${getPostSlug(note)}`;
}

/**
 * Posts and notes interleaved by date — what "recent writing" actually means
 * now that a note is a first-class piece of writing.
 */
export async function getRecentWriting(limit = 6) {
  const [posts, notes] = await Promise.all([getAllPosts(), getAllNotes()]);

  const entries = [
    ...posts.map((post) => ({
      kind: "post" as const,
      title: post.data.title,
      summary: post.data.summary,
      date: post.data.publishedDate,
      url: getPostUrl(post),
      label: COLLECTION_LABELS[post.collection] ?? post.collection,
      entry: post,
    })),
    ...notes.map((note) => ({
      kind: "note" as const,
      title: note.data.title,
      summary: note.data.summary ?? "",
      date: note.data.publishedDate,
      url: getNoteUrl(note),
      label: "Note",
      entry: note,
    })),
  ];

  return entries
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit);
}
