// components/GameCanvas.jsx
import React, { useEffect, useRef } from "react";

export default function GameCanvas({ selectedCharacter }) {
  const gameRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && selectedCharacter) {
      // Import Phaser dynamically to avoid SSR issues
      import("phaser").then((Phaser) => {
        import("../phaser-scenes/PipelineScene").then((sceneModule) => {
          const PipelineScene = sceneModule.default;

          // Pass the selected character to Phaser globally
          window.selectedCharacter = selectedCharacter;

          const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 450,
            parent: gameRef.current,
            scene: [PipelineScene],
            scale: {
              mode: Phaser.Scale.FIT,
              autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            physics: { default: "arcade" },
          };

          const game = new Phaser.Game(config);

          return () => game.destroy(true);
        });
      });
    }
  }, [selectedCharacter]);

  return (
    <div
      ref={gameRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    />
  );
}
