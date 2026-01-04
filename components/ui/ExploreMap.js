import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ExploreMap({ learns = [] }) {
  const router = useRouter();
  const [radius, setRadius] = useState(220);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setRadius(width < 600 ? 120 : width < 900 ? 180 : 230);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🌀 Circular positioning for learns
  const nodePositions = learns.map((_, i) => {
    const angle = (i / learns.length) * 2 * Math.PI;
    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    };
  });

  return (
    <div className="relative flex items-center justify-center w-full h-[650px] bg-gradient-to-b from-[#050510] to-[#090821] rounded-2xl border border-green-500 shadow-lg overflow-hidden">
      {/* 💠 Jenkins Core */}
      <motion.div
        className="absolute w-28 h-28 rounded-full bg-green-400/20 border-2 border-green-500 shadow-[0_0_40px_#00ff88] flex items-center justify-center text-green-400 font-extrabold text-2xl"
        animate={{
          rotate: 360,
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 0 40px #00ff88",
            "0 0 80px #00ff88",
            "0 0 40px #00ff88",
          ],
        }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        J
      </motion.div>

      {/* 🚀 Learn Nodes */}
      {learns.map((learn, i) => {
        const { x, y } = nodePositions[i];
        const isCompleted =
          typeof window !== "undefined" &&
          localStorage.getItem(`learn-jenkins-${learn.id}`) === "completed";

        return (
          <motion.div
            key={learn.id}
            className="absolute flex flex-col items-center cursor-pointer"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => router.push(`/learn/jenkins/${learn.id}`)}
          >
            <motion.div
              whileHover={{ scale: 1.25, boxShadow: "0 0 25px #00ff88" }}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-black font-bold border ${
                isCompleted
                  ? "bg-green-400 border-green-600 shadow-[0_0_25px_#00ff88]"
                  : "bg-gray-700 border-green-400 shadow-[0_0_10px_#333]"
              }`}
            >
              {i + 1}
            </motion.div>
            <span className="mt-2 text-xs text-green-300 whitespace-nowrap">
              {learn.title}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
