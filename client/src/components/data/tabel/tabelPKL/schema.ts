import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const PKLSchema = z.object({
  nim: z.string(),
  nama: z.string(),
  angkatan: z.string(),
  nilai : z.number(),
})

export type dataPKL = z.infer<typeof PKLSchema>