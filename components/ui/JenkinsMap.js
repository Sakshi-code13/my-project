import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Cog } from "lucide-react";

export default function JenkinsMap({ missions = [], onSelect }) {
  const [hovered, setHovered] = useState(null);
  const [xp, setXp] = useState(0);

  // XP = number of unlocked missions * 100
  useEffect(() => {
    const total = missions.filter((m) => m.unlocked).length * 100;
    setXp(total);
  }, [missions]);

  // ✅ Dynamically generate coordinates for all missions
  const positions = missions.map((_, i) => ({
    x: 120 + i * 180 + (i % 2 === 0 ? 0 : 40), // more spacing for longer scroll
    y: 80 + (i % 2 === 0 ? 40 : 120), // alternating up/down
  }));

  if (!missions || missions.length === 0) {
    return (
      <div className="text-gray-400 italic p-6 text-center">
        No missions available.
      </div>
    );
  }

  // 🧠 Calculate container width dynamically
  const mapWidth = Math.max(900, missions.length * 200);

  return (
    <div className="relative w-full h-[460px] bg-gradient-to-b from-[#060510] to-[#090821] rounded-2xl border border-green-500 shadow-lg overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-transparent">
      {/* Inner scrollable area */}
      <div className="relative inline-block" style={{ width: `${mapWidth}px`, height: "100%" }}>
        
        {/* XP Progress Bar */}
        <div className="absolute top-3 left-6 right-6">
          <div className="w-[90%] bg-green-900/40 rounded-full h-3 border border-green-600 mx-auto">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-lime-500 h-3 rounded-full shadow-[0_0_20px_#00ff88]"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((xp / (missions.length * 100)) * 100, 100)}%`,
              }}
              transition={{ duration: 1.2 }}
            />
          </div>
          <p className="text-right text-xs text-green-400 mt-1 pr-12">{xp} XP</p>
        </div>

        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full">
          {missions.map((_, i) => {
            if (i === 0 || !positions[i - 1] || !positions[i]) return null;
            const prev = positions[i - 1];
            const curr = positions[i];
            return (
              <motion.line
                key={`line-${i}`}
                x1={prev.x + 15}
                y1={prev.y + 15}
                x2={curr.x + 15}
                y2={curr.y + 15}
                stroke="url(#glow)"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.3, duration: 0.6 }}
              />
            );
          })}
          <defs>
            <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00ff99" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00ff55" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Mission Nodes */}
        {missions.map((mission, i) => {
          const { x, y } = positions[i];
          const isUnlocked = mission.unlocked !== false;

          return (
            <motion.div
              key={mission.id || i}
              className="absolute flex flex-col items-center"
              style={{ left: x, top: y }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.3 }}
            >
              {isUnlocked && (
                <motion.div
                  className="absolute w-10 h-10 text-green-400 opacity-50"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                >
                  <Cog size={40} />
                </motion.div>
              )}

              <motion.div
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ scale: 1.15 }}
                onClick={() => isUnlocked && onSelect(mission)}
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold cursor-pointer
                  ${
                    isUnlocked
                      ? "bg-green-400 shadow-[0_0_20px_#00ff88]"
                      : "bg-gray-500 opacity-50 cursor-not-allowed"
                  }`}
              >
                {i + 1}
              </motion.div>

              <span className="mt-2 text-xs text-green-300 text-center w-24">
                {mission.title || mission.name}
              </span>

              {hovered === i && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: -20 }}
                  className="absolute -top-8 bg-black/80 text-green-300 text-xs px-3 py-1 rounded border border-green-600 shadow-lg"
                >
                  {isUnlocked
                    ? `XP: ${mission.xp || 100}`
                    : "🔒 Locked — Complete earlier mission"}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
