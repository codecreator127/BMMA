"use client"
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

const dummy = [
  { name: "john", level: 2 },
  { name: "alice", level: 2 },
  { name: "dharm", level: 2 },
  { name: "min", level: 2 },
  { name: "gaea", level: 2 },
  { name: "vincent", level: 2 },
];
const rounds = 10;

const names_dict = {
  "john" : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "alice" : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "dharm" : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "min" : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "gaea" : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
}

export default function Courts() {

  const [matchHistory, setMatchHistory] = useState({});

  // create initial matchHistory dictionary
  let dict: Record<string, any> = {}
  for (let i = 0; i < dummy.length; i++) {
    dict[dummy[i].name] = [];
  }


  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16">
      <table className="table-auto border-collapse border border-gray-400">
        <tbody>
          {Array.from({ length: 2 }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: 6 }, (_, colIndex) => (
                <td
                  key={colIndex}
                  className="border border-gray-400 w-40 h-40 text-center text-lg font-bold"
                >
                  <p className="p-5">name1 name2 name3 name4</p>
                  
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
