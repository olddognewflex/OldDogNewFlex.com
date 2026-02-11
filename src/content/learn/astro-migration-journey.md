---
# src/content/learn/astro-migration-journey.md
title: "From Next.js to Astro: A Migration Journey"
subtitle: "Why I chose Astro for my personal blog and what I learned"
summary: "After starting with Next.js, I discovered Astro's content-focused approach was perfect for my blog. Here's what I learned during the migration."
section: learn
publishedDate: 2025-07-01
tags: ["astro", "migration", "nextjs", "performance"]
featured: false
status: published
---

> **Context Note**  
> This post was written earlier in the life of Old Dog, New Flex while I was still shaping the editorial direction. I’m leaving it here because it reflects how I think — even as the framing continues to evolve.

# From Next.js to Astro: A Migration Journey

When I started building “Old Dog, New Flex,” I did what any self-respecting React developer would do—I reached for
Next.js. It’s familiar, it’s robust, and it’s basically the Swiss Army knife of React frameworks. But a few thousand
lines of code later, I had a nagging feeling: Was I building a spaceship to deliver a pizza?

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

Next.js is brilliant—if you’re building the next Facebook. But for a blog? I was loading React just to spit out some
static text. My blog posts weren’t exactly interactive masterpieces requiring client-side hydration and the
computational power of a small country.

## Enter Astro

Astro's philosophy hit me like a breath of fresh air (or at least, less polluted air):

- Ship zero JavaScript by default
- Use the right tool for each component
- Content-first approach

Here's the same blog post logic in Astro:

```astro
// So much simpler, faster, and easier for newbs to understand
const { post } = Astro.props;
const { Content } = await post.render();

<article>
  <Content />
</article>
```

Suddenly, things made sense. No more convoluted data fetching for static content. No more pretending my blog was a
single-page app when it was, in fact, a glorified notebook. Astro let me build with just HTML and CSS—unless I wanted
to get fancy. Zero JavaScript unless I asked for it. Complexity is optional, not mandatory.

Astro is also UI-agnostic. Want to sprinkle in a React component? Go ahead. Svelte, Vue, Solid, HTMX, or some weird web
component you found in a back alley? No problem. Start simple, scale up as needed, and add bells and whistles only when
you’re ready to tolerate them.

## Why Astro

Astro’s core design principles speak to my inner (and outer) full-stack engineer:

### Content Driven

Astro is made for content. Most frameworks want you to build the next big web app; Astro wants you to publish words on
the internet and scale up only when you’re good and ready. Walk first, then run—no need to enter a marathon just to
write a blog post.

### Server First

Server rendering, but without needing to learn a new server-side language or summon arcane knowledge. It’s just HTML,
CSS, and JavaScript (or TypeScript, if you like living dangerously).

### Fast by Default

With Astro, you basically have to try to make your site slow. Challenge accepted, but also: why?

### Easy to Use

If you know HTML, you know Astro. The `.astro` UI language is just HTML with a cape.

### Developer Focused

Astro is open source, backed by a large community of developers who care about building great tools. The ecosystem is
friendly, the docs are sane, and the experience is refreshingly untraumatic.

## Key Takeaways from swithging to the Astro Setup

1. **Performance**: Zero JavaScript shipped by default. Your Lighthouse scores will thank you.
2. **Type Safety**: Full TypeScript support with content collections. No more “undefined is not a function” surprises.
3. **Flexibility**: Use React, Vue, Svelte, Solid, or whatever’s trendy this week—only where you actually need them.
4. **Simplicity**: Way simpler than Next.js for content sites. Less code, fewer headaches.
5. **Great DX**: Excellent development experience. You might actually enjoy building your site.
6. **SEO**: Static content, great SEO, and Google won’t hate you.

## What I Learned

Sometimes the “modern” solution is just overkill. Just because you can build a rocket ship doesn’t mean you
should—especially when all you need is a bicycle. Astro let me focus on content, not configuration, and reminded me that
the simplest solution is often the best (and the least likely to break at 2 a.m.).
