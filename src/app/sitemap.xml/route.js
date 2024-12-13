// generate sitemap
import { differenceInYears } from 'date-fns';
import { getAllPosts } from '@/lib/posts';

async function getSitemap() {
  const map = [
    {
      url: 'https://blog.iamjkahn.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://blog.iamjkahn.com/about',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: 'https://blog.iamjkahn.com/posts',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://blog.iamjkahn.com/speaking',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }
  ];

  const posts = await getAllPosts();

  posts.forEach((post) => {
    console.log(post)
    map.push({
      url: `https://blog.iamjkahn.com/posts/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: (differenceInYears(new Date(), new Date(post.date)) > 3 ? 0.3 : 0.6),
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    ${map.map(
        (item) => `
            <url>
              <loc>${item.url}</loc>
              <lastmod>${item.lastModified.toISOString()}</lastmod>
              <changefreq>${item.changeFrequency}</changefreq>
              <priority>${item.priority}</priority>
            </url>
          `,
      )
      .join('')}
    </urlset>
  `;
};

export async function GET() {
  return new Response(await getSitemap(), {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}