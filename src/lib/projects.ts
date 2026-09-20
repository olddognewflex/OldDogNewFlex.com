import { type CollectionEntry, getCollection } from "astro:content";
import { getAllPosts, getPostUrl, type BlogPost } from "./blog";

export type Project = CollectionEntry<"projects">;
export type ProjectStatus = Project["data"]["status"];
export type ProjectKind = Project["data"]["kind"];

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  building: "Building",
  exploring: "Exploring",
  paused: "Paused",
  shipped: "Shipped",
  archived: "Archived",
};

export const KIND_LABELS: Record<ProjectKind, string> = {
  product: "Products",
  "open-source": "Open Source",
  practice: "Practice",
};

/**
 * Display order for the workbench. Active work first, finished work after it,
 * things that stalled last — a workbench, not a trophy shelf.
 */
const STATUS_ORDER: ProjectStatus[] = [
  "building",
  "exploring",
  "shipped",
  "paused",
  "archived",
];

export function getProjectSlug(project: Project): string {
  const source = project.filePath ?? project.id ?? "";
  return (source.split("/").pop() ?? "").replace(/\.(md|mdx)$/, "");
}

export function getProjectUrl(project: Project): string {
  return `/projects/${getProjectSlug(project)}`;
}

export async function getAllProjects(): Promise<Project[]> {
  const projects = await getCollection("projects");
  return projects
    .filter((project) => !project.data.draft)
    .sort((a, b) => {
      const byStatus =
        STATUS_ORDER.indexOf(a.data.status) - STATUS_ORDER.indexOf(b.data.status);
      if (byStatus !== 0) return byStatus;
      return (a.data.order ?? 99) - (b.data.order ?? 99);
    });
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const projects = await getAllProjects();
  const featured = projects.filter((project) => project.data.featured);
  return (featured.length > 0 ? featured : projects).slice(0, limit);
}

/** Projects grouped by kind, in KIND_LABELS order, empty groups dropped. */
export async function getProjectsByKind(): Promise<
  { kind: ProjectKind; label: string; projects: Project[] }[]
> {
  const projects = await getAllProjects();
  return (Object.keys(KIND_LABELS) as ProjectKind[])
    .map((kind) => ({
      kind,
      label: KIND_LABELS[kind],
      projects: projects.filter((project) => project.data.kind === kind),
    }))
    .filter((group) => group.projects.length > 0);
}

/** Resolve a project's `related` slugs to real entries, dropping dangling ones. */
export async function getRelatedProjects(project: Project): Promise<Project[]> {
  const slugs = project.data.related ?? [];
  if (slugs.length === 0) return [];
  const all = await getAllProjects();
  return slugs
    .map((slug) => all.find((p) => getProjectSlug(p) === slug))
    .filter((p): p is Project => Boolean(p));
}

/** Posts whose tags intersect the project's `writingTags`. */
export async function getRelatedWriting(
  project: Project,
): Promise<{ post: BlogPost; url: string }[]> {
  const wanted = project.data.writingTags ?? [];
  if (wanted.length === 0) return [];
  const posts = await getAllPosts();
  return posts
    .filter((post) => (post.data.tags ?? []).some((tag) => wanted.includes(tag)))
    .map((post) => ({ post, url: getPostUrl(post) }));
}
