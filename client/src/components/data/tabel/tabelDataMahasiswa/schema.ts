import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const mahasiswaSchema = z.object({
  nim: z.string(),
  nama: z.string(),
  status: z.string(),
  angkatan: z.string(),
})

export type dataMahasiswa = z.infer<typeof mahasiswaSchema>