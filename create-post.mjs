#!/usr/bin/env node

import fs from "fs";
import slug from "slug";
import { input, select } from "@inquirer/prompts";

const title = await input({
  message: "Title: "
});

const titleSlug = await input({
  message: "Slug: ",
  default: slug(title)
});

const style = await select({
  message: "Post style: ",
  choices: [
    {
      value: "local",
      name: "local",
      description: "Post on this blog",
      default: true
    },
    {
      value: "link",
      name: "link",
      description: "Link post"
    }
  ]
});

let url = null;
if (style === "link") {
   url = await input({
    message: "Link URL: "
  });
};

const now = new Date();
const date = {
  year: await input({ message: "Year: ", default: now.getFullYear() }),
  month: await input({ message: "Month: ", default: now.getMonth() + 1 }),
  date: await input({ message: "Date: ", default: now.getDate() })
};

const postSlug = `${date.year}-${date.month}-${date.date}-${titleSlug}`;

// check for existing file
if (fs.existsSync(`./src/app/_posts/${postSlug}.md`)) {
  throw "Post with this slug already exists"
}

let frontMatter = `---
slug: "${postSlug}"
date: "${new Date(date.year, date.month, date.date).toISOString()}"
title: "${title}"
author: "Josh"
summary: ""
`;

if (style === "link" && url) {
  frontMatter = frontMatter.concat(`redirect_link: ${url}\n`);
}

frontMatter = frontMatter.concat("---");

fs.writeFileSync(
  `./src/app/_posts/${postSlug}.md`,
  frontMatter
);
