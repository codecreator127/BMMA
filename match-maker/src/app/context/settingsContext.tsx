'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface SettingsContextType {
  courts: number;
  setCourts: (courts: number) => void;
  rounds: number;
  setRounds: (rounds: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [courts, setCourts] = useState<number>(11);
  const [rounds, setRounds] = useState<number>(10);

  return (
    <SettingsContext.Provider value={{ courts, setCourts, rounds, setRounds }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
    const context = useContext(SettingsContext)
    if (context === undefined) {
      throw new Error('useSettings must be used within a SettingsProvider')
    }
    return context
  }