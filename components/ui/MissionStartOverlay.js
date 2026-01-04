import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function MissionStartOverlay({ mission, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.(); // Trigger redirect after animation
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {mission && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm text-green-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Mission Title */}
          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-5xl font-extrabold text-center mb-4 drop-shadow-[0_0_25px_#00ff88]"
          >
            {mission.name}
          </motion.h1>

          {/* Mission Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-green-300 italic mb-10"
          >
            {mission.description || "Prepare for deployment..."}
          </motion.p>

          {/* XP Effect */}
          <motion.div
            className="text-3xl font-bold text-lime-400"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            +{mission.xp || 100} XP ⚡
          </motion.div>

          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            style={{
              background: "radial-gradient(circle, rgba(0,255,100,0.3), transparent 70%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
