import { z } from "zod"
import { Semester } from "./data"

export const PKLSchema = z.object({
  nim: z.string(),
  nama: z.string(),
  angkatan: z.string(),
  nilai : z.string(),
  semester : z.string(),
})

export type dataPKL = z.infer<typeof PKLSchema>