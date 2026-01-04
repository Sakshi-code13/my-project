// components/missions/JenkinsMission12.jsx
"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";

function JenkinsMission12({ onComplete = () => {} }) {
  const blocksInitial = ["Deploy", "Test", "Build", "Push", "Package", "Merge"];
  const [blocks, setBlocks] = useState([]);
  const XP = 300;
  const success = useRef(null);

  // ✅ Load sounds and randomize only on client after hydration
  useEffect(() => {
    success.current = new Audio("/assets/sounds/success.mp3");

    // Shuffle only after the component mounts (avoids hydration mismatch)
    const shuffled = [...blocksInitial].sort(() => Math.random() - 0.5);
    setBlocks(shuffled);
  }, []);

  const moveUp = (i) => {
    if (i === 0) return;
    const arr = [...blocks];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    setBlocks(arr);
  };

  const moveDown = (i) => {
    if (i === blocks.length - 1) return;
    const arr = [...blocks];
    [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
    setBlocks(arr);
  };

  const check = () => {
    const required = ["Merge", "Build", "Test", "Package", "Push", "Deploy"];
    if (blocks.join(",") === required.join(",")) {
      success.current?.play().catch(() => {});
      localStorage.setItem("mission-jenkins-12", "completed");
      const prev = parseInt(localStorage.getItem("xp") || "0", 10);
      localStorage.setItem("xp", String(prev + XP));
      setTimeout(() => onComplete({ xp: XP }), 1200);
    } else {
      alert(
        "❌ Incorrect order!\nHint: Think like CI/CD — Merge → Build → Test → Package → Push → Deploy."
      );
    }
  };

  return (
    <div className="p-6 bg-black text-green-300 min-h-[520px]">
      <h2 className="text-2xl mb-4">Mission 12 — The Final Orchestrator</h2>

      {blocks.length === 0 ? (
        <div className="text-center text-gray-400 animate-pulse">
          Initializing orchestration matrix...
        </div>
      ) : (
        <div className="max-w-2xl bg-gray-900 p-4 rounded border border-green-700">
          {blocks.map((b, i) => (
            <div
              key={`${b}-${i}`}
              className="flex items-center justify-between bg-black/60 p-2 mb-2 rounded"
            >
              <div>
                {i + 1}. {b}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => moveUp(i)}
                  className="px-2 py-1 bg-gray-700 rounded"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveDown(i)}
                  className="px-2 py-1 bg-gray-700 rounded"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={check}
          disabled={blocks.length === 0}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 disabled:opacity-50"
        >
          🚀 Orchestrate
        </button>
      </div>
    </div>
  );
}

// ✅ Disable SSR to prevent any hydration conflicts
export default dynamic(() => Promise.resolve(JenkinsMission12), { ssr: false });
