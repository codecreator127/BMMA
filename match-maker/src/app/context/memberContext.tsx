'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface MembersContextType {
  members: Map<string, number>[]
  matchHistory: Map<string, number[]>[]
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
  const [membersLevel, setMembersAndLevel] = useState<Map<string, number>[]>([]);
  const [membersMatchHistory, setMembersMatchHistory] = useState<Map<string, number[]>[]>([]);

  useEffect(() => {
    setMembersAndLevel(dummy);

  // Initialize matchHistory as an array of Maps
  const matchHistory: Map<string, number[]>[] = [];

    dummy.forEach((memberMap: Map<string, number>) => {
      // Create a new Map for each member entry
      const memberHistory = new Map<string, number[]>();

      memberHistory.set(Array.from(memberMap.entries())[0][0], [])

      // Add this Map to the matchHistory array
      matchHistory.push(memberHistory);
    });

    setMembersMatchHistory(matchHistory);

  }, []); // Runs only once when the component mounts

  return (
    <MembersContext.Provider value={{ members: membersLevel, matchHistory: membersMatchHistory }}>
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
