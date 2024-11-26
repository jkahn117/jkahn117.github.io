import { redirect } from 'next/navigation';
import { remark } from 'remark';
import html from 'remark-html';
import { PostLayout } from '@/components/PostLayout';
import { getAllPosts, getPost } from '@/lib/posts';

// Enable static generation of post pages
// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const posts = await getAllPosts();

  if (!posts || posts.length === 0) { return [{ slug: 'not-found' }] }

  return posts.map((post) => ({
    slug: post.slug.split('/').slice(0, 3)
  }));
}


export default async function Page(props) {
  const params = await props.params;
  const { slug } = params;
  if (!slug) { redirect('/not-found'); }

  const post = await getPost(slug.join('/'));
  if (!post) { redirect('/not-found'); }

  const content = await remark().use(html).process(post.content);

  return (
    <PostLayout post={ post } content={ content.toString() } />
  )
}