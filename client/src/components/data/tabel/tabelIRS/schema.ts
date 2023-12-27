import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const verifikasiSchema = z.object({
  nim: z.string().nullable(),
  nama: z.string().nullable(),
  angkatan: z.string().nullable(),
  semester: z.string().nullable(),
  sks: z.string().nullable(),
})

export type dataVerifikasi = z.infer<typeof verifikasiSchema>