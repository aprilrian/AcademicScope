import { z } from "zod"
import { Semester } from "./data"

export const skripsiSchema = z.object({
  nim: z.string(),
  nama: z.string(),
  angkatan: z.string(),
  nilai : z.string(),
  semester : z.string(),
})

export type dataSkripsi = z.infer<typeof skripsiSchema>