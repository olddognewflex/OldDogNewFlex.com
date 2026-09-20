import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blogSchema = z.object({
	title: z.string(),
	subtitle: z.string().optional(),
	summary: z.string(),
	// Transform string to Date object
	publishedDate: z.coerce.date(),
	updatedDate: z.coerce.date().optional(),
	heroImage: z.string().optional(),
	tags: z.array(z.string()).optional(),
	featured: z.boolean().optional(),
	draft: z.boolean().optional(),
	// Editorial lens, carried in existing posts. Declared so it stops being
	// silently stripped; nothing reads it yet — the collection is the lens.
	section: z.string().optional(),
	status: z.string().optional(),
});

/**
 * Notes are deliberately cheaper to write than posts: no required summary, no
 * subtitle, no hero. That reduced ceremony is the entire point — a note should
 * never feel like it owes anyone 1,500 words.
 */
const notesSchema = z.object({
	title: z.string(),
	summary: z.string().optional(),
	publishedDate: z.coerce.date(),
	updatedDate: z.coerce.date().optional(),
	tags: z.array(z.string()).optional(),
	// Optional outbound link, for a note that is mostly "look at this thing".
	link: z.string().url().optional(),
	draft: z.boolean().optional(),
});

const projectsSchema = z.object({
	name: z.string(),
	tagline: z.string(),
	// Drives the page template and the grouping on /projects. Deliberately not
	// exposed as filter UI — surfacing the taxonomy makes the site feel
	// over-structured.
	kind: z.enum(["product", "open-source", "practice"]),
	status: z.enum(["building", "exploring", "paused", "shipped", "archived"]),
	tech: z.array(z.string()).optional(),
	links: z
		.array(z.object({ label: z.string(), url: z.string() }))
		.optional(),
	// Slugs of sibling projects, rendered as a plain "Related: X · Y" line.
	related: z.array(z.string()).optional(),
	// Tags used to pull matching writing onto the project page.
	writingTags: z.array(z.string()).optional(),
	featured: z.boolean().optional(),
	// Lower sorts first within a status group.
	order: z.number().optional(),
	startedDate: z.coerce.date().optional(),
	updatedDate: z.coerce.date().optional(),
	draft: z.boolean().optional(),
});

const collectionFor = (dir: string, schema: z.ZodTypeAny) =>
	defineCollection({
		loader: glob({ base: `./src/content/${dir}`, pattern: "**/*.{md,mdx}" }),
		schema,
	});

export const collections = {
	learn: collectionFor("learn", blogSchema),
	share: collectionFor("share", blogSchema),
	journey: collectionFor("journey", blogSchema),
	notes: collectionFor("notes", notesSchema),
	projects: collectionFor("projects", projectsSchema),
};
