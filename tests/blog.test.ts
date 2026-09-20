import { describe, it, expect } from 'vitest';
import { getPostSlug, getPostUrl, getNoteUrl, type BlogPost, type Note } from '../src/lib/blog';

describe('getPostSlug', () => {
  it('strips a .md extension', () => {
    expect(getPostSlug({ filePath: 'src/content/learn/intro.md' })).toBe('intro');
  });

  it('strips a .mdx extension', () => {
    expect(getPostSlug({ filePath: 'src/content/share/advanced.mdx' })).toBe('advanced');
  });

  it('falls back to id when filePath is absent', () => {
    expect(getPostSlug({ id: 'learn/from-id.md' })).toBe('from-id');
  });

  it('returns an empty slug rather than throwing on an empty entry', () => {
    expect(getPostSlug({})).toBe('');
  });
});

describe('getPostUrl', () => {
  it('removes .md extension from file path', () => {
    const post = { collection: 'learn', filePath: 'posts/intro.md' } as unknown as BlogPost;
    expect(getPostUrl(post)).toBe('/learn/intro');
  });

  it('removes .mdx extension from file path', () => {
    const post = { collection: 'share', filePath: 'posts/advanced.mdx' } as unknown as BlogPost;
    expect(getPostUrl(post)).toBe('/share/advanced');
  });

  it('agrees with getPostSlug, which is what the .mdx 404 bug came from', () => {
    const post = { collection: 'learn', filePath: 'posts/thing.mdx' } as unknown as BlogPost;
    expect(getPostUrl(post)).toBe(`/learn/${getPostSlug(post)}`);
  });
});

describe('getNoteUrl', () => {
  it('builds a /notes permalink', () => {
    const note = { filePath: 'src/content/notes/a-short-thought.md' } as unknown as Note;
    expect(getNoteUrl(note)).toBe('/notes/a-short-thought');
  });
});
