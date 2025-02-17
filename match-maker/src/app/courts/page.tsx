"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { useMembers } from "../context/memberContext";
import { Player } from "../utils";

export default function Courts() {
  const { currentRound, updatePlayerMatchHistory, setCurrentRoundMatches, membersMap } = useMembers();
  const [editableRound, setEditableRound] = useState<Player[][]>([]);

  useEffect(() => {
    // Deep copy the current round to avoid direct mutation
    setEditableRound(JSON.parse(JSON.stringify(currentRound)));
  }, [currentRound]);

  // Calculate number of columns needed (split groups evenly between 2 rows)
  const columnsPerRow = Math.ceil(editableRound.length / 2);
  
  // Split groups into two rows
  const firstRow = editableRound.slice(0, columnsPerRow);
  const secondRow = editableRound.slice(columnsPerRow);

  const handlePlayerNameChange = (
    rowIndex: number, 
    colIndex: number, 
    playerIndex: number, 
    newName: string
  ): void => {
    const newRound = [...editableRound];
    let groupNum = rowIndex === 0 ? colIndex : colIndex + columnsPerRow;

    const currPlayer = editableRound[groupNum][playerIndex];
    
    if (newRound[groupNum] && newRound[groupNum][playerIndex]) {
      // Update the player name in our local state
      newRound[groupNum][playerIndex].name = newName;
      setEditableRound(newRound);

      groupNum ++;
      
      updatePlayerMatchHistory(currPlayer.name, newName, groupNum);
      
      const changedGroup = currentRound[groupNum - 1];


      try {
        const player = membersMap.get(newName);
        if (player) {

          const replacementIndex = playerIndex;
          
          changedGroup[replacementIndex] = player;
    
          currentRound[groupNum - 1] = changedGroup;
          setCurrentRoundMatches(currentRound);
        } else {
          //  TODO: Add some sort of error msg, + change onChange to after the user submits or smt
          console.log("enter a valid name");
        }
      } catch {

        console.log("error getting valid player from name")
      }

      console.log(changedGroup);

      
    }
  };

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16">
      <table className="w-full border-collapse">
        <tbody>
          {[firstRow, secondRow].map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((group, colIndex) => {
                const courtNumber = rowIndex === 0 ? colIndex + 1 : colIndex + columnsPerRow + 1;
                return (
                  <td key={colIndex} className="border border-gray-400 w-40 h-40 text-center relative bg-white">
                    {/* Court number header */}
                    <div className="absolute top-0 left-0 right-0 bg-gray-100 border-b border-gray-400 py-1 font-bold">
                      Court {courtNumber}
                    </div>
                    {/* Players list */}
                    <div className="pt-8 px-2">
                      {group.map((player, playerIndex) => (
                        <div 
                          key={playerIndex} 
                          className={`py-1 ${playerIndex !== group.length - 1 ? 'border-b border-gray-200' : ''}`}
                        >
                          <input
                            type="text"
                            value={player.name}
                            onChange={(e) => handlePlayerNameChange(rowIndex, colIndex, playerIndex, e.target.value)}
                            className="w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="p-5">
        <Link href="/home">
          <div className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Home
          </div>
        </Link>
      </div>
    </div>
  );
}