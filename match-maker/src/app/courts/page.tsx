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
                {row.map((group, colIndex) => (
                  <td key={colIndex} className="border border-gray-400 w-40 h-40 text-center text-lg font-bold">
                    <p className="p-5">
                      {group.map(player => player.name).join('\n')}
                    </p>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

      <Link href="/home">
          <div className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Home
          </div>
      </Link>
    </div>
  );
}
