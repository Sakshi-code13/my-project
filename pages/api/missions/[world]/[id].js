import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Import mission data (for now static; later MongoDB)
import { jenkinsMissions } from "@/data/missions/jenkins";

export default function MissionPage() {
  const router = useRouter();
  const { world, id } = router.query;
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (!world || !id) return;
    setLoading(true);

    // Fetch mission data (replaceable with API later)
    if (world === "jenkins") {
      const found = jenkinsMissions.find((m) => m.id === parseInt(id));
      setMission(found || null);
    }

    setLoading(false);
  }, [world, id]);

  if (loading)
    return (
      <div className="h-screen w-screen flex items-center justify-center text-green-400 bg-black">
        Loading Mission...
      </div>
    );

  if (!mission)
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-red-500">
        <p>❌ Mission not found.</p>
        <button
          onClick={() => router.push(`/world?character=${world}`)}
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg"
        >
          Back to World
        </button>
      </div>
    );

  // 🎬 INTRO TRANSITION
  if (showIntro) {
    return (
      <motion.div
        className="h-screen w-screen flex flex-col items-center justify-center bg-black text-green-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl font-extrabold mb-4 drop-shadow-[0_0_25px_#00ff88]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          {mission.name}
        </motion.h1>
        <motion.p
          className="text-lg text-green-300 italic mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {mission.description}
        </motion.p>

        <motion.button
          onClick={() => setShowIntro(false)}
          className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Start Mission 🚀
        </motion.button>
      </motion.div>
    );
  }

  // 🎮 ACTUAL MISSION AREA
  return (
    <div className="relative h-screen w-screen bg-gradient-to-b from-[#020202] via-[#050510] to-[#0a0a0f] text-green-300 p-10 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-400 drop-shadow-lg">
          {mission.name}
        </h1>
        <button
          onClick={() => router.push(`/world?character=${world}`)}
          className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
        >
          Exit Mission ✖
        </button>
      </div>

      {/* Info Section */}
      <div className="bg-black/50 p-6 rounded-xl border border-green-700 mb-8">
        <h2 className="text-xl font-semibold text-green-400 mb-2">
          🎯 Objective
        </h2>
        <p className="text-gray-300 mb-4">{mission.description}</p>

        <h2 className="text-xl font-semibold text-green-400 mb-2">
          🧠 Focus Area
        </h2>
        <p className="text-gray-300 mb-4">{mission.focusArea}</p>

        <h2 className="text-xl font-semibold text-green-400 mb-2">
          🎮 Mission Type
        </h2>
        <p className="text-gray-300 mb-4">{mission.type}</p>

        <h2 className="text-xl font-semibold text-green-400 mb-2">⭐ XP</h2>
        <p className="text-gray-300">{mission.xp} XP</p>
      </div>

      {/* Placeholder for actual game (Phase 2) */}
      <div className="bg-black/40 border border-green-500 rounded-xl p-8 text-center text-green-300 text-lg">
        🧩 This is where your <b>{mission.type}</b> mini-game will appear.
        <br />
        (Coming in Phase 2)
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        {mission.id > 1 ? (
          <button
            onClick={() =>
              router.push(`/mission/${world}/${mission.id - 1}`)
            }
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
          >
            ← Previous
          </button>
        ) : (
          <div></div>
        )}

        {mission.id < jenkinsMissions.length && (
          <button
            onClick={() =>
              router.push(`/mission/${world}/${mission.id + 1}`)
            }
            className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
