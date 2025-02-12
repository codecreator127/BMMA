'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

import { Player } from '../utils'

interface MembersContextType {
  membersMap: Map<string, Player>
  matchHistory: Map<Player, number[]>
  currentRound: Player[][]
  setCurrentRoundMatches: (matches: Player[][]) => void;
  setMembers: (memberLevels: Map<string, Player>) => void;
  setMembersMatchHistory: (memberMatchHistory: Map<Player, number[]>) => void;
}

const nameLevels = new Map<string, number>([
  ['Liam', 2],
  ['Emma', 1],
  ['Noah', 3],
  ['Olivia', 2],
  ['William', 1],
  ['Ava', 3],
  ['James', 2],
  ['Isabella', 1], 
  ['Oliver', 3],
  ['Sophia', 2],
  ['Benjamin', 1],
  ['Charlotte', 3],
  ['Elijah', 2],
  ['Mia', 1],
  ['Lucas', 3],
  ['Amelia', 2],
  ['Mason', 1],
  ['Harper', 3],
  ['Logan', 2],
  ['Evelyn', 1],
  ['Alexander', 3],
  ['Abigail', 2],
  ['Ethan', 1],
  ['Emily', 3],
  ['Jacob', 2],
  ['Elizabeth', 1],
  ['Michael', 3],
  ['Sofia', 2],
  ['Daniel', 1],
  ['Avery', 3],
  ['Henry', 2],
  ['Ella', 1],
  ['Jackson', 3],
  ['Scarlett', 2],
  ['Sebastian', 1],
  ['Victoria', 3],
  ['Aiden', 2],
  ['Madison', 1],
  ['Matthew', 3],
  ['Luna', 2],
  ['Samuel', 1],
  ['Grace', 3],
  ['David', 2],
  ['Chloe', 1],
  ['Joseph', 3],
  ['Zoe', 2],
  ['Christopher', 1],
  ['Penelope', 3],
  ['Andrew', 2],
  ['Claire', 1]
 ]);

const MembersContext = createContext<MembersContextType | undefined>(undefined);

export function init(setMatchHistory: (matchHistory: Map<Player, number[]>) => void, setMembers: (members: Map<string, Player>) => void, nameLevels: Map<string, number>) {

  let membersMap = new Map();

  const matchHistory: Map<Player, number[]> = new Map();

  nameLevels.forEach((level, name) => {
      let currentPlayer = new Player(name, level);

      membersMap.set(name, currentPlayer);
      matchHistory.set(currentPlayer, [0]);
    });

    setMembers(membersMap);
    setMatchHistory(matchHistory);

} 

export function MembersProvider({ children }: { children: ReactNode }) {
  const [membersObjectMap, setMembers] = useState<Map<string, Player>>(new Map());
  const [membersMatchHistory, setMembersMatchHistory] = useState<Map<Player, number[]>>(new Map());
  const [currentRoundMatches, setCurrentRoundMatches] = useState<Player[][]>([]);
  // const [nameLevel, setNameLevel] = useState<string|number[]>([])

  useEffect(() => {
    init(setMembersMatchHistory, setMembers, nameLevels);

  }, []); // Runs only once when the component mounts

  
  useEffect(() => {

    console.log(membersObjectMap);

  }, [membersObjectMap]);


  return (
    <MembersContext.Provider value={{ membersMap: membersObjectMap, matchHistory: membersMatchHistory, currentRound: currentRoundMatches, setCurrentRoundMatches, setMembers, setMembersMatchHistory}}>
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
