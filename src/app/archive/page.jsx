import { redirect } from 'next/navigation';

// capture old route from previous blog

export default async function Page() {
  redirect('/posts');
}