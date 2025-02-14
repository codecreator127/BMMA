"use client"
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

import { useMembers } from "../context/memberContext";
import { useTheme } from "../context/themeContext";

const ROUNDS = 10;

export default function Courts() {

  const { theme, toggleTheme } = useTheme();
  const { currentRound } = useMembers();

  console.log(currentRound);

  // Calculate number of columns needed (split groups evenly between 2 rows)
  const columnsPerRow = Math.ceil(currentRound.length / 2);
  
  // Split groups into two rows
  const firstRow = currentRound.slice(0, columnsPerRow);
  const secondRow = currentRound.slice(columnsPerRow);

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16">
    <table className="w-full border-collapse">
          <tbody>
            {[firstRow, secondRow].map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((group, colIndex) => {
                  const courtNumber = rowIndex === 0 ? colIndex + 1 : colIndex + 7;
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
                            {player.name}
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
