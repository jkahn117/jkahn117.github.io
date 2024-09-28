import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { getAllPosts } from '@/lib/posts'
import { formatDate } from '@/lib/formatDate'

function Post({ post }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={ post.redirect_link ? post.redirect_link : `/posts/${post.slug}`}>
          {post.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={post.date}
          className="md:hidden"
          decorate
        >
          {formatDate(post.date)}
        </Card.Eyebrow>
        <Card.Description>{post.summary}</Card.Description>
        <Card.Cta>Read post</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={post.date}
        className="mt-1 hidden md:block"
      >
        {formatDate(post.date)}
      </Card.Eyebrow>
    </article>
  )
}

export const metadata = {
  title: 'Posts',
  description:
    'My long-form posts on technology, various musings, and a back catalog of posts over twenty plus years.',
}

export default async function ArticlesIndex() {
  let posts = await getAllPosts()

  return (
    <SimpleLayout
      title="Collected posts from Blogger.com circa 2005 to today."
      intro="Long-form posts on technology, various musings, and a back catalog of posts over twenty plus years in chronological order."
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          {posts.map((post) => (
            <Post key={ post.slug } post={ post } />
          ))}
        </div>
      </div>
    </SimpleLayout>
  )
}
