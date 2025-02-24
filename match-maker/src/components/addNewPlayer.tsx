"use client";

import { useState } from "react";

interface PopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, level: number) => void;
}

export default function PopupForm({ isOpen, onClose, onSubmit }: PopupFormProps) {
  const [playerName, setPlayerName] = useState("");
  const [playerLevel, setPlayerLevel] = useState<number | "">("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!playerName.trim() || playerLevel === "") {
      setError("Both fields are required.");
      return;
    }
    onSubmit(playerName, Number(playerLevel));
    setPlayerName(""); // Reset input fields
    setPlayerLevel("");
    setError(""); // Clear error message
    onClose(); // Close the popup
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Add Player</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>

        <input
          type="text"
          placeholder="Enter player name"
          value={playerName}
          onChange={(e) => {
            setPlayerName(e.target.value);
            if (error) setError(""); // Clear error on user input
          }}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
        />

        <input
          type="number"
          placeholder="Enter player level"
          value={playerLevel}
          onChange={(e) => {
            setPlayerLevel(e.target.value === "" ? "" : Number(e.target.value));
            if (error) setError(""); // Clear error on user input
          }}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
          min="1"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
