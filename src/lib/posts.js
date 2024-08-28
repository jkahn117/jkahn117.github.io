import { cache } from 'react';
import { readFile } from 'node:fs/promises';
import path from 'path';
import { glob } from 'fast-glob';
import matter from 'gray-matter';

const POSTS_PATH = 'src/app/_posts/';

/**
 * 
 */
export const getAllPosts = cache(async() => {
  // get files in the app/_posts directory
  const fileNames = await glob(path.join(POSTS_PATH, '*.md'));

  const allPosts = await Promise.all(fileNames.map(async (fileName) => {
    // read markdown of file
    const source = await readFile(fileName);

    // load frontmatter
    const frontmatter = matter(source);

    fileName = fileName.replace(POSTS_PATH, '');

    return {
      slug: getSlug(fileName),
      ...frontmatter.data
    };
  }));

  // sort by date
  return allPosts.sort((a, z) => {
    return (a.date < z.date) ? 1 : -1;
  });
});

/**
 * 
 */
export const getPost = cache(async(slug) => {
  const parts = slug.match(/(\d+)\/(\d\d)\/([\w\-]+)/);

  const postFile = await glob(path.join(POSTS_PATH, `${parts[1]}-${parts[2]}-*-${parts[3]}.md`));
  if (postFile.length < 1) { return null; }

  const source = await readFile(postFile[0]);
  const { data, content } = matter(source);

  return {
    ...data,
    content
  }
});

/**
 * Calculate slug from post data
 * @param {*} post 
 * @returns slug
 */
const getSlug = (fileName) => {
  return fileName.replace(/(\d+)-(\d\d)-\d\d-([\w\-]+).mdx?$/, '$1/$2/$3')
};
