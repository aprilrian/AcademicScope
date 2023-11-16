/**
 * v0 by Vercel.
 * @see https://v0.dev/t/hUgbHeqAbJM
 */
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function Component() {
  return (
    <Card className="mx-auto max-w-md p-6 rounded-lg shadow-xl bg-white dark:bg-zinc-900">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage alt="User Avatar" src="../monkey.jpg" />
          <AvatarFallback>CJ</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Christian Joshua</h2>
        </div>
      </div>
      <div className="mt-8 border-t pt-6 space-y-2">
        <div className="flex justify-between">
          <span className="font-medium text-sm">Nama Lengkap:</span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Christian Joshua Nathanael Nadeak</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-sm">Alamat:</span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Jl. Sakti 9 No. 8</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-sm">Email:</span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">christianjoshua@students.undip.ac.id</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-sm">No. Telephone:</span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">081298981570</span>
        </div>
      </div>
    </Card>
  )
}
