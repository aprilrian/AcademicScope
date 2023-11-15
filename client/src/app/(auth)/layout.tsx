import type { Metadata } from 'next'

import AuthLayout from '@/components/layouts/auth-layouts'

export const metadata: Metadata = {
  title: 'AcademicScope',
  description: '',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>
}