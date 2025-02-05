'use client'

import Link from 'next/link'
import { useTheme } from '@/app/context/themeContext'
import { useMembers } from '@/app/context/memberContext'

import { Player, shuffleArray } from '../utils'


const COURTS = 11;
const MAX_PLAYERS_ON_COURT = COURTS * 4;

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { membersMap, matchHistory, setCurrentRoundMatches } = useMembers();

  const rounds: number = 5; // Define rounds (adjust as needed)

  // takes a list of members and their last played status
  //outputs a list of players that are ready to play (or closest to ready)
  //TODO: put committee as low priority
  function selectReady(matchHistory: Map<Player, number[]>): Player[] {
    let readyPlayers: Player[] = [];

    // Iterate over the Map entries directly
    for (const [player, matches] of matchHistory) {
        // Check if the last match is 0
        if (matches[matches.length - 1] === 0) {
            readyPlayers.push(player);
        }
    }

    return readyPlayers;
}


function makeMatch(matchHistory: Map<Player, number[]>) {
  alert("making match");
  let readyPlayers: Player[] = selectReady(matchHistory);
  let groupedPlayers: Player[][] = Array.from({ length: 11 }, () => []);
  let ungroupedPlayers: Player[] = [];
  let courtsFilled = false;
  let currentRoundPlayers = 0;

  //shuffle players first
  shuffleArray(readyPlayers);

  // First pass - exact level matching
  let i = 0;
  while (i < readyPlayers.length && !courtsFilled) {
      let grouped: boolean = false;
      let currentPlayer = readyPlayers[i];
      
      for (let j = 0; j < groupedPlayers.length; j++) {
          if (groupedPlayers[j].length === 0) {
              groupedPlayers[j].push(currentPlayer);
              grouped = true;
              break;
          }
          else if (groupedPlayers[j].length < 4) {
              let groupLevel = groupedPlayers[j][0].level;
              
              if (groupLevel === currentPlayer.level) {
                  groupedPlayers[j].push(currentPlayer);
                  grouped = true;
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
      }

      i++;
  }

  // Second pass - try to place ungrouped players with ±1 level difference
  if (ungroupedPlayers.length > 0) {
      console.log("Attempting to place ungrouped players with ±1 level tolerance");
      
      const stillUngrouped: Player[] = [];
      
      for (const player of ungroupedPlayers) {
          let placed = false;
          
          for (let j = 0; j < groupedPlayers.length; j++) {
              if (groupedPlayers[j].length > 0 && groupedPlayers[j].length < 4) {
                  const groupLevel = groupedPlayers[j][0].level;
                  
                  // Check if player's level is within ±1 of the group's level
                  if (Math.abs(groupLevel - player.level) <= 1) {
                      groupedPlayers[j].push(player);
                      placed = true;
                      currentRoundPlayers++;
                      console.log(`Placed player level ${player.level} in group with level ${groupLevel}`);
                      break;
                  }
              }
          }
          
          if (!placed) {
              stillUngrouped.push(player);
          }
      }

      // Update ungroupedPlayers to only contain those we couldn't place
      ungroupedPlayers = stillUngrouped;
  }

  console.log("Final groups:", groupedPlayers.filter(group => group.length > 0));
  console.log("Still ungrouped players:", ungroupedPlayers);
  setCurrentRoundMatches(groupedPlayers);


  
  alert("matches made");
  return;
}


  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16">
    <table className="table-auto border-collapse border border-gray-400">
      <tbody>
        {Array.from(membersMap).map(([name, Player], rowIndex) => (
          <tr key={rowIndex}>
            <td className="border border-gray-400 px-4 py-2 text-center font-bold">
              {name} ({Player.level})
            </td>
            {Array.from({ length: rounds }, (_, colIndex) => (
              <td
                key={colIndex}
                className="border border-gray-400 px-4 py-2 text-center"
              >
                {/* Add content for the other columns if needed */}
              </td>
            ))}
          </tr>
        ))}
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
    </div>
  );
}
