import { getAllPosts } from '@/lib/posts';
import assert from 'assert';
import { Feed } from 'feed';

export async function GET(req) {
  let siteUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:3000';

  const author = {
    name: 'Josh Kahn'
  }

  let feed = new Feed({
    title: 'iamjkahn',
    description: 'Random musings of a solutions architect, speaker, technology guy, dad',
    author,
    id: siteUrl,
    link: siteUrl,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
    },
  });

  const posts = (await getAllPosts()).slice(0, 5);

  posts.forEach((post) => {
    assert(typeof post.title === 'string')
    assert(typeof post.date === 'string')
    assert(typeof post.summary === 'string')

    const postUrl = `${siteUrl}/posts/${post.slug}`;

    feed.addItem({
      title: post.title,
      id: postUrl,
      link: postUrl,
      content: post.summary,
      author: [ author ],
      contributor: [ author ],
      date: new Date(post.date)
    })
  });

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      'content-type': 'application/xml',
      'cache-control': 's-maxage=31556952',
    },
  })
}