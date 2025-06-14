---
# src/content/learn/astro-migration-journey.md
title: "From Next.js to Astro: A Migration Journey"
subtitle: "Why I chose Astro for my personal blog and what I learned"
publishedDate: 2024-05-27
summary: "After starting with Next.js, I discovered Astro's content-focused approach was perfect for my blog. Here's what I learned during the migration."
tags: ["astro", "nextjs", "migration", "performance"]
featured: true
---

# From Next.js to Astro: A Migration Journey

When I first started building "Old Dog, New Flex," I naturally reached for Next.js. It's what I know, it's React-based, and it seemed like the obvious choice. But as I got deeper into the project, I realized I was over-engineering a content site.

## The Realization

```typescript
// This felt like overkill for a blog
export default async function BlogPost({ params }: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params; // Really? For a static blog post?
  const post = await getPost(slug);

  return <div>{post.content}</div>;
}
```

Don't get me wrong - Next.js is fantastic. But for a content-focused blog, I was loading React for... what exactly? To display static text?

## Enter Astro

Astro's philosophy resonated with me immediately:

- Ship zero JavaScript by default
- Use the right tool for each component
- Content-first approach

Here's the same blog post logic in Astro:

```astro
// So much simpler and faster
const { post } = Astro.props;
const { Content } = await post.render();

<article>
  <Content />
</article>
```

## What I Learned

The migration taught me that sometimes the "modern" solution isn't always the right solution...

[Continue with your insights and experiences]

## Key Advantages of This Astro Setup

1. **Performance**: Zero JavaScript shipped by default
2. **Type Safety**: Full TypeScript support with content collections
3. **Flexibility**: Use React components only where needed
4. **Simplicity**: Much simpler than Next.js for content sites
5. **Great DX**: Excellent development experience
6. **SEO**: Perfect for static content with great SEO

## Next Steps

1. **Run the setup commands** to create the Astro project
2. **Create your content schema** and first blog post
3. **Build and test** the site locally
4. **Deploy to Netlify/Vercel** - both support Astro excellently

This gives you a much cleaner, faster solution while still leveraging your TypeScript skills and allowing you to use React components where you need interactivity (like the code copy button).

Want me to help you with any specific part of the migration or have questions about Astro's patterns?
