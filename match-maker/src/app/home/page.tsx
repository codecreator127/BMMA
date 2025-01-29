'use client'

import Link from 'next/link'
import { useTheme } from '@/app/context/themeContext'
import { useMembers } from '@/app/context/memberContext'
import { useState } from 'react'

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { members } = useMembers();

  console.log(members);

  const [matchHistory, setMatchHistory] = useState<Record<string, any>>({});

  // Create initial matchHistory dictionary
  let dict: Record<string, any> = {};
  members.forEach((memberMap: Map<string, number>) => {
    const firstEntry = Array.from(memberMap.entries())[0]; // Get first entry safely
    if (firstEntry) {
      const [name] = firstEntry;
      dict[name] = [];
    }
  });

  const rounds: number = 5; // Define rounds (adjust as needed)


  // make into an api call in the future?
  function makeMatch() {
    // make this come up with a set of matches and then change the context list
    alert("making match");

    alert("matches made");
    return;

  }


  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16">
      <table className="table-auto border-collapse border border-gray-400">
        <tbody>
          {members.map((memberMap: Map<string, number>, rowIndex: number) => {
            const firstEntry = Array.from(memberMap.entries())[0]; // Ensure safe extraction
            if (!firstEntry) return null; // Skip empty maps

            const [name, level] = firstEntry; // Destructure safely

            return (
              <tr key={rowIndex}>
                <td className="border border-gray-400 px-4 py-2 text-center font-bold">
                  {name} ({level})
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
        onClick={makeMatch}
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
