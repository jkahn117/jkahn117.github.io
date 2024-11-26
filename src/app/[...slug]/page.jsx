import { redirect } from 'next/navigation';
import { getAllPosts } from '@/lib/posts';

// component attempts to save some broken links that google
// has previously crawling in the form:
// https://..../year/month/slug.html (no "posts")


// Enable static generation of post pages
// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const posts = await getAllPosts();

  if (!posts || posts.length === 0) { return [{ slug: 'not-found' }] }

  return posts.map((post) => {
    let parts = post.slug.split('/').slice(0, 3);
    parts[parts.length - 1] = `${parts[parts.length - 1]}.html`
    
    return {
      slug: parts
    }
  });
}

export default async function Page(props) {
  const params = await props.params;
  const { slug } = params;

  redirect(`/posts/${slug.join("/").replace(/\.html$/, "")}`)
};