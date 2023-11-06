'use client'

import { AppProgressBar } from 'next-nprogress-bar'

import NextAuthProviders from './next-auth-provider'
import ReactQueryProviders from './react-query-provider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProviders>
      <ReactQueryProviders>
        {children}
        <AppProgressBar height='2px' color='#000' options={{ showSpinner: false }} shallowRouting />
      </ReactQueryProviders>
    </NextAuthProviders>
  )
}