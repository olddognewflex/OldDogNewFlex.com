import { type CollectionEntry, getCollection } from "astro:content";
import readingTime from "reading-time";

export type BlogPost = CollectionEntry<"learn" | "share" | "journey">;

export async function getAllPosts(
  category?: "learn" | "share" | "journey",
): Promise<BlogPost[]> {
  const collections = category
    ? [await getCollection(category)]
    : await Promise.all([
      getCollection("learn"),
      getCollection("share"),
      getCollection("journey"),
    ]);

  const posts = collections
    .flat()
    .filter((post) => !post.data.draft)
    .sort(
      (a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime(),
    );

  return posts;
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.data.featured).slice(0, 3);
}

export function getReadingTime(content: string): string {
  return readingTime(content).text;
}

export function getPostUrl(post: BlogPost): string {
  const category = post.collection;
  return `/${category}/${
    post.filePath?.split("/").pop()?.replace(".md", "") || ""
  }`;
}
