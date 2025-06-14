import { describe, it, expect } from 'vitest';
import { getPostUrl, type BlogPost } from '../src/lib/blog';

describe('getPostUrl', () => {
  it('removes .md extension from file path', () => {
    const post = { collection: 'learn', filePath: 'posts/intro.md' } as BlogPost;
    expect(getPostUrl(post)).toBe('/learn/intro');
  });

  it('removes .mdx extension from file path', () => {
    const post = { collection: 'share', filePath: 'posts/advanced.mdx' } as BlogPost;
    expect(getPostUrl(post)).toBe('/share/advanced');
  });
});
