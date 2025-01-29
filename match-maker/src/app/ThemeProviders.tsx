// app/Providers.tsx
'use client'

import { ThemeProvider } from '@/app/context/themeContext'
import { ReactNode } from 'react'

export function ThemeProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
