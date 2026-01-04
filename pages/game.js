// pages/game.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GameCanvas from "../components/GameCanvas";

export default function GamePage() {
  const router = useRouter();
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    if (router.query.character) {
      setSelectedCharacter(router.query.character);
    }
  }, [router.query]);

  // Wait until we know which character was selected
  if (!selectedCharacter) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-green-400 text-2xl">
        Loading your hero...
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      <GameCanvas selectedCharacter={selectedCharacter} />
    </div>
  );
}
