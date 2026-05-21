import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const changelog = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/changelog" }),
  schema: z.object({
    version: z.string(),
    date: z.coerce.date(),
    headline: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    fixes: z.array(z.string()).optional(),
  }),
});

export const collections = { changelog };
