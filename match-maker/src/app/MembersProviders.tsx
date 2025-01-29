// app/Providers.tsx
'use client'

import { MembersProvider } from '@/app/context/memberContext';
import { ReactNode } from 'react'

export function MembersProviders({ children }: { children: ReactNode }) {
  return <MembersProvider>{children}</MembersProvider>
}
