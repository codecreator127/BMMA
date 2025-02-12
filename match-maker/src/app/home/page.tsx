'use client'

import Link from 'next/link'
import { useTheme } from '@/app/context/themeContext'
import { useMembers } from '@/app/context/memberContext'

import { Player, shuffleArray } from '../utils'

import CSVUploader from '../csvUploadButton'
import { init } from '@/app/context/memberContext';


const COURTS = 11;
const MAX_PLAYERS_ON_COURT = COURTS * 4;
const ROUNDS = 10;

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { membersMap, matchHistory, setCurrentRoundMatches, setMembers , setMembersMatchHistory} = useMembers();

  // takes a list of members and their last played status
  //outputs a list of players that are ready to play (or closest to ready)
  //TODO: put committee as low priority
  function selectReady(matchHistory: Map<Player, number[]>): Player[] {
    let readyPlayers: Player[] = [];
  
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
  let readyPlayers: Player[] = selectReady(matchHistory);
  let groupedPlayers: Player[][] = Array.from({ length: COURTS }, () => []);
  let ungroupedPlayers: Player[] = [];
  let courtsFilled = false;
  let currentRoundPlayers = 0;

  console.log(readyPlayers);
  console.log(matchHistory);

  //shuffle players first
  shuffleArray(readyPlayers);

  // First pass - exact level matching
  for (let i = 0; i < readyPlayers.length; i ++) {
      let grouped: boolean = false;
      let currentPlayer = readyPlayers[i];
      let currentPlayerCourt = 0;
      
      for (let j = 0; j < groupedPlayers.length; j++) {
          if (groupedPlayers[j].length === 0) {
              groupedPlayers[j].push(currentPlayer);
              grouped = true;
              currentPlayerCourt = j;
              break;
          }
          else if (groupedPlayers[j].length < 4) {
              let groupLevel = groupedPlayers[j][0].level;
              
              if (groupLevel === currentPlayer.level) {
                  groupedPlayers[j].push(currentPlayer);
                  grouped = true;
                  currentPlayerCourt = j;
                  break;
              }
          }
      }

      if (currentRoundPlayers === MAX_PLAYERS_ON_COURT) {
          courtsFilled = true;
      }

      if (!grouped) {
          ungroupedPlayers.push(currentPlayer);
      } else {
          currentRoundPlayers++;
          // update current players match history
          let matchHistoryEntry = matchHistory.get(currentPlayer) ?? [];
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

                      let matchHistoryEntry = matchHistory.get(currentPlayer) ?? [];
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
    let matchHistoryEntry = matchHistory.get(player) ?? [];
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


  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16">
    <table className="table-auto border-collapse border border-gray-400">
      <tbody>
        {Array.from(membersMap).map(([name, Player], rowIndex) => {
          const history = matchHistory.get(Player) || []; // Default to an empty array
          return (
            <tr key={rowIndex}>
              <td>{name} ({Player.level})</td>
              {Array.from({ length: ROUNDS }, (_, colIndex) => (
                <td key={colIndex}>{history[colIndex] ?? ' '}</td> // Use optional chaining and fallback
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>

      <Link href="courts">
        <div className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Current Games
        </div>
      </Link>

      <button 
        onClick={() => makeMatch(matchHistory)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Make Match
      </button>

      <button 
        onClick={toggleTheme}
        className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
      >
        Current theme: {theme}
      </button>



      <CSVUploader onProcessCSV={handleCSVData} />
    </div>
  );
}
