import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const verifikasiSchema = z.object({
  mahasiswa_nim: z.string(),
  nama: z.string(),
  angkatan: z.string(),
  semester_aktif: z.string(),
  sks : z.string(),
})

export type dataVerifikasi = z.infer<typeof verifikasiSchema>