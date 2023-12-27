import { SessionProvider } from 'next-auth/react'

export default function NextAuthProviders({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}