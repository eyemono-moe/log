#!/usr/bin/env zx
import "zx/globals";

// copy template.md and rename it to `src/content/posts/YYMMdd-xxx.md`
const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
const title = Math.random().toString(36).substring(2, 8);
await $`cp scripts/create-post/template.md src/content/posts/${date}-${title}.md`;
