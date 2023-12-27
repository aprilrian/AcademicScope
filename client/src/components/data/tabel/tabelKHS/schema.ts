import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const KHSSchema = z.object({
  nim: z.string(),
  nama: z.string(),
  angkatan: z.string(),
  semester: z.string(),
  ip: z.string(),
})

export type dataVerifikasi = z.infer<typeof KHSSchema>