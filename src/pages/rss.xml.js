import rss from '@astrojs/rss';
import { getAllNotes, getAllPosts, getNoteUrl, getPostUrl } from '../lib/blog';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
  // getAllPosts/getAllNotes already drop drafts — calling getCollection()
  // directly here is what used to leak unpublished work into the feed.
  const [posts, notes] = await Promise.all([getAllPosts(), getAllNotes()]);

  const items = [
    ...posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.publishedDate,
      link: `${getPostUrl(post)}/`,
    })),
    ...notes.map((note) => ({
      title: note.data.title,
      description: note.data.summary ?? '',
      pubDate: note.data.publishedDate,
      link: `${getNoteUrl(note)}/`,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items,
  });
}
