import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const manajemenSchema = z.object({
  username: z.string(),
  nama: z.string(),
  email: z.string(),
  role: z.string(),
})

export type dataManajemen = z.infer<typeof manajemenSchema>