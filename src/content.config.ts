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
});

const learnCollection = defineCollection({
        // Load Markdown and MDX files in the `src/content/learn/` directory.
	loader: glob({ base: "./src/content/learn", pattern: "**/*.{md,mdx}" }),
	// Type-check frontmatter using a schema
	schema: blogSchema,
});

const shareCollection = defineCollection({
	// Load Markdown and MDX files in the `src/content/share/` directory.
	loader: glob({ base: "./src/content/share", pattern: "**/*.{md,mdx}" }),
	// Type-check frontmatter using a schema
	schema: blogSchema,
});

const journeyCollection = defineCollection({
	// Load Markdown and MDX files in the `src/content/journey/` directory.
	loader: glob({ base: "./src/content/journey", pattern: "**/*.{md,mdx}" }),
	// Type-check frontmatter using a schema
	schema: blogSchema,
});

export const collections = {
	learn: learnCollection,
	share: shareCollection,
	journey: journeyCollection,
};
