'use client'

import Link from 'next/link'
// import { useTheme } from '@/app/context/themeContext'
import { useMembers } from '@/app/context/memberContext'

import { Player, shuffleArray } from '../utils'

import CSVUploader from '../../components/csvUploadButton'
import { init } from '@/app/context/memberContext';
import { useState } from 'react'
import Timer from '../../components/timer'
import { useSettings } from '../context/settingsContext'

import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import PopupForm from '@/components/addNewPlayer'

  export default function Home() {
  const { membersMap, matchHistory, setCurrentRoundMatches, setMembers, setMembersMatchHistory } = useMembers();
  const { courts, rounds } = useSettings();
  const MAX_PLAYERS_ON_COURT = courts * 4;
  const [sortBy, setSortBy] = useState('name');

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleFormSubmitNewPlayer = (name: string, level: number) => {
    console.log("Player added:", { name, level });
    // Handle the player submission logic here
    const newPlayer: Player = new Player(name, level);
    membersMap.set(name, newPlayer);
    setMembers(membersMap);

    const anyPlayer = matchHistory.keys().toArray()[0];

    const roundsPassed = matchHistory.get(anyPlayer)?.length;
    if (roundsPassed) {
      console.log(roundsPassed);
      matchHistory.set(newPlayer, Array.from({ length: roundsPassed }, () => 0));
      setMembersMatchHistory(matchHistory);
    }

  };

  // Keep existing functions (sortedMembers, splitIntoTables, makeMatch, etc.)
  const sortedMembers = (): [string, Player][] => {
    const members = Array.from(membersMap as Map<string, Player>);
    if (sortBy === 'name') {
      return members.sort(([nameA], [nameB]) => nameA.localeCompare(nameB));
    } else if (sortBy === 'level') {
      return members.sort(([, playerA], [, playerB]) => playerB.level - playerA.level);
    }
    return members;
  };

  const splitIntoTables = (members: [string, Player][]): [string, Player][][] => {
    const tables: [string, Player][][] = [[], []];
    members.forEach((member, index) => {
      const tableIndex = Math.floor(index / (members.length / 2));
      tables[tableIndex].push(member);
    });
    return tables;
  };

  const renderTable = (members: [string, Player][], tableIndex: number) => (
    <Card key={tableIndex} className="w-full">
      <CardContent className="pt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player (Level)</TableHead>
              {Array.from({ length: rounds }, (_, i) => (
                <TableHead key={i} className="text-center w-12">R{i + 1}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map(([name, player], rowIndex) => {
              const history = matchHistory.get(player) || [];
              return (
                <TableRow key={rowIndex}>
                  <TableCell className="font-medium">{name} ({player.level})</TableCell>
                  {Array.from({ length: rounds }, (_, colIndex) => (
                    <TableCell key={colIndex} className="text-center">
                      {history[colIndex] ?? ' '}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

    // takes a list of members and their last played status
    //outputs a list of players that are ready to play (or closest to ready)
    //TODO: put committee as low priority
    function selectReady(matchHistory: Map<Player, number[]>): Player[] {
      const readyPlayers: Player[] = [];
    
      let matchesAgoPlayed = 1;
      while (readyPlayers.length < MAX_PLAYERS_ON_COURT) {
        
        for (const [player, matches] of matchHistory) {
          // Check if the matches ago played is 0
          if (matches[matches.length - matchesAgoPlayed] == 0 && !readyPlayers.includes(player)) {
              readyPlayers.push(player);
          }

          console.log(readyPlayers.length);
        }
        matchesAgoPlayed ++;

      }
      return readyPlayers;
    }

  function makeMatch(matchHistory: Map<Player, number[]>) {
    alert("making match");
    const readyPlayers: Player[] = selectReady(matchHistory);
    const groupedPlayers: Player[][] = Array.from({ length: courts }, () => []);
    let ungroupedPlayers: Player[] = [];
    let currentRoundPlayers = 0;

    console.log(readyPlayers);
    console.log(matchHistory);

    //shuffle players first
    shuffleArray(readyPlayers);

    // First pass - exact level matching
    for (let i = 0; i < readyPlayers.length; i ++) {
        let grouped: boolean = false;
        const currentPlayer = readyPlayers[i];
        let currentPlayerCourt = 0;
        
        for (let j = 0; j < groupedPlayers.length; j++) {
            if (groupedPlayers[j].length === 0) {
                groupedPlayers[j].push(currentPlayer);
                grouped = true;
                currentPlayerCourt = j;
                break;
            }
            else if (groupedPlayers[j].length < 4) {
                const groupLevel = groupedPlayers[j][0].level;
                
                if (groupLevel === currentPlayer.level) {
                    groupedPlayers[j].push(currentPlayer);
                    grouped = true;
                    currentPlayerCourt = j;
                    break;
                }
            }
        }

        if (currentRoundPlayers === MAX_PLAYERS_ON_COURT) {
            break;
        }

        if (!grouped) {
            ungroupedPlayers.push(currentPlayer);
        } else {
            currentRoundPlayers++;
            // update current players match history
            const matchHistoryEntry = matchHistory.get(currentPlayer) ?? [];
            matchHistoryEntry?.push(currentPlayerCourt + 1);
            matchHistory.set(currentPlayer, matchHistoryEntry);
        }
    }

    // Second pass - try to place ungrouped players with ±1 level difference
    if (ungroupedPlayers.length > 0) {
        console.log("Attempting to place ungrouped players with ±1 level tolerance");
        
        const stillUngrouped: Player[] = [];
        
        for (const currentPlayer of ungroupedPlayers) {
            let placed = false;
            
            for (let j = 0; j < groupedPlayers.length; j++) {
                if (groupedPlayers[j].length > 0 && groupedPlayers[j].length < 4) {
                    const groupLevel = groupedPlayers[j][0].level;
                    const currentPlayerCourt = j;
                    
                    // Check if player's level is within ±1 of the group's level
                    if (Math.abs(groupLevel - currentPlayer.level) <= 1) {
                        groupedPlayers[j].push(currentPlayer);
                        placed = true;
                        currentRoundPlayers++;
                        console.log(`Placed player level ${currentPlayer.level} in group with level ${groupLevel}`);

                        const matchHistoryEntry = matchHistory.get(currentPlayer) ?? [];
                        matchHistoryEntry?.push(currentPlayerCourt + 1);
                        matchHistory.set(currentPlayer, matchHistoryEntry); 

                        break;
                    }
                }
            }
            
            if (!placed) {
              stillUngrouped.push(currentPlayer);
            }
        }

        // Update ungroupedPlayers to only contain those we couldn't place
        ungroupedPlayers = stillUngrouped;
    }

    console.log("Final groups:", groupedPlayers.filter(group => group.length > 0));
    console.log("Still ungrouped players:", ungroupedPlayers);
    setCurrentRoundMatches(groupedPlayers);


    //update all the players who arent playing this round
    const allPlayers = membersMap.values();
    const playersNotPlaying = Array.from(allPlayers.filter(player => !groupedPlayers.flat().includes(player)));

    console.log(playersNotPlaying);

    for (const player of playersNotPlaying) {
      // update current players match history
      const matchHistoryEntry = matchHistory.get(player) ?? [];
      matchHistoryEntry?.push(0);
      matchHistory.set(player, matchHistoryEntry); 
    }

    
    alert("matches made");
    return;
    }

    const handleCSVData = (data: string[][]) => {
      console.log('Processed CSV data:', data);
      
      const nameLevels : Map<string, number> = new Map();
      for (const player of data) {
        const name = player[0];
        const level = parseInt(player[1]);

        nameLevels.set(name, level);
      }
      init(setMembersMatchHistory, setMembers, nameLevels);
    };


    const tables = splitIntoTables(sortedMembers());

    return (
      <div className="min-h-screen bg-gray-50 p-8 pb-24">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="level">Sort by Level</SelectItem>
              </SelectContent>
            </Select>

            <Timer />
          </div>
  
          {/* Tables Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {tables.map((members, index) => renderTable(members, index))}
          </div>
  
          {/* Action Buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-4">
              <Link href="courts">
                <Button variant="default">
                  Current Games
                </Button>
              </Link>
  
              <Button 
                onClick={() => makeMatch(matchHistory)}
                variant="default"
              >
                Make Match
              </Button>
  
              <Link href="/settings">
                <Button variant="outline">
                  Settings
                </Button>
              </Link>
  
              <CSVUploader onProcessCSV={handleCSVData} />

              <Button onClick={() => setIsPopupOpen(true)}>Add Player</Button>

              <PopupForm
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onSubmit={handleFormSubmitNewPlayer}
              />

            </div>
          </div>
        </div>
      </div>
    );
  }