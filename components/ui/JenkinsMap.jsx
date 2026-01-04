import { motion } from "framer-motion";

export default function JenkinsMap({ missions, onSelect }) {
  return (
    <svg viewBox="0 0 1000 600" className="w-full h-[600px]">
      {missions.map((m, i) => {
        const x = 100 + i * 80;
        const y = 300 + Math.sin(i / 2) * 120;
        const unlocked = m.unlocked;
        const completed = m.completed;

        return (
          <motion.circle
            key={m.id}
            cx={x}
            cy={y}
            r={completed ? 18 : 14}
            fill={completed ? "#22c55e" : unlocked ? "#4ade80" : "#1f2937"}
            stroke="#10b981"
            strokeWidth="3"
            initial={{ scale: 0.8 }}
            animate={{ scale: completed ? 1.2 : 1 }}
            transition={{ duration: 0.5, yoyo: Infinity }}
            className={unlocked ? "cursor-pointer" : "opacity-40"}
            onClick={() => unlocked && onSelect(m)}
          />
        );
      })}
      {/* connecting lines */}
      {missions.slice(1).map((m, i) => {
        const x1 = 100 + i * 80;
        const y1 = 300 + Math.sin(i / 2) * 120;
        const x2 = 100 + (i + 1) * 80;
        const y2 = 300 + Math.sin((i + 1) / 2) * 120;
        return (
          <line
            key={`line-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#10b981"
            strokeWidth="2"
            opacity="0.5"
          />
        );
      })}
    </svg>
  );
}
