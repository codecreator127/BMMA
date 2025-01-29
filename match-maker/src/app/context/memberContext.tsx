'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface MembersContextType {
  members: Map<string, number>[]
}

// Dummy data as a list of maps
const dummy: Map<string, number>[] = [
  new Map([["john", 2]]),
  new Map([["alice", 2]]),
  new Map([["dharm", 2]]),
  new Map([["min", 2]]),
  new Map([["gaea", 2]]),
  new Map([["vincent", 2]]),
];

const MembersContext = createContext<MembersContextType | undefined>(undefined);

export function MembersProvider({ children }: { children: ReactNode }) {
  const [names, setNames] = useState<Map<string, number>[]>([]);

  useEffect(() => {
    setNames(dummy);
  }, []); // Runs only once when the component mounts

  return (
    <MembersContext.Provider value={{ members: names }}>
      {children}
    </MembersContext.Provider>
  );
}

export function useMembers() {
  const context = useContext(MembersContext);
  if (context === undefined) {
    throw new Error('useMembers must be used within a MembersProvider');
  }
  return context;
}
