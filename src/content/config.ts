import { defineCollection, z } from 'astro:content';

const postCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().nonempty(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  })
});

export const collections = {
  'posts': postCollection,
};