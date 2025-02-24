// app/Providers.tsx
'use client'

import { MembersProvider } from '@/app/context/memberContext';
import { SettingsProvider } from './settingsContext';
import { ThemeProvider } from './themeContext';
import { ReactNode } from 'react'

export function MembersProviders({ children }: { children: ReactNode }) {
  return <MembersProvider>{children}</MembersProvider>
}

export function ThemeProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

export function SettingsProviders({ children }: { children: ReactNode }) {
  return <SettingsProvider>{children}</SettingsProvider>
}
