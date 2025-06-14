import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
  const collections = await Promise.all([
    getCollection('learn'),
    getCollection('share'),
    getCollection('journey'),
  ]);

  const posts = collections
    .flat()
    .sort((a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime());

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => {
      const slug = post.id.split('/').pop().replace(/\.(md|mdx)$/, '');
      return {
        ...post.data,
        link: `/${post.collection}/${slug}/`,
      };
    }),
  });
}
