// components/LearnScene.js
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { getLearnXp, getNextAfterLearn } from "@/data/progression";
console.log("Rendering LearnScene for part:", part);

export default function LearnScene({ topic = "jenkins", part = 1 }) {
  const router = useRouter();
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const clickSound = useRef(null);
  const bgMusic = useRef(null);

  useEffect(() => {
    clickSound.current = new Audio("/assets/sounds/click.mp3");
    bgMusic.current = new Audio("/assets/sounds/holo_ambience.mp3");
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.4;
    bgMusic.current.play().catch(() => {});
  }, []);

  const currentLesson = jenkinsDialogues[part];
const dialogues = currentLesson?.lines || [
  { speaker: "Jenkins 🤖", line: "⚠️ Lesson data missing for this part." },
];
const title = currentLesson?.title || "Jenkins Training";
const type = currentLesson?.type || "dialogue";


  // Auto-progression of dialogues
  useEffect(() => {
    if (dialogueIndex < dialogues.length - 1) {
      const timer = setTimeout(() => setDialogueIndex((i) => i + 1), 4000);
      return () => clearTimeout(timer);
    } else {
      setCompleted(true);
    }
  }, [dialogueIndex]);

  // 🔹 THIS is the only redirect now
  const handleContinue = () => {
  clickSound.current?.play();

  const xpGain = getLearnXp(topic, part);
  const totalXp = parseInt(localStorage.getItem("xp") || "0", 10) + xpGain;

  localStorage.setItem(`learn-${topic}-${part}`, "completed");
  localStorage.setItem("xp", String(totalXp));
  
  const numericPart = Number(part);
  const nextPath = getNextAfterLearn(topic, numericPart);

  console.log("DEBUG: Next path from LearnScene =", nextPath); // 👈 Add this line

  if (nextPath) {
    router.push(nextPath);
  } else {
    alert("⚠️ Mission path not found. Check your progression file!");
  }
};


  const current = dialogues[dialogueIndex];

  return (
    <motion.div
      className="w-screen h-screen flex flex-col items-center justify-center bg-black text-green-300 overflow-hidden font-mono relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      style={{
        background: "radial-gradient(circle at center, #001f1f 0%, #000 100%)",
      }}
    >
      <motion.div
        className="absolute inset-0 bg-[url('/assets/images/holo_grid.png')] bg-cover opacity-20"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />

      <motion.img
        src="/assets/images/jenkins-core.png"
        alt="Jenkins"
        className="w-52 h-52 mb-6 opacity-90"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />

      <motion.div
        className="relative w-[80%] max-w-3xl bg-black/70 border border-green-700 rounded-2xl p-6 shadow-[0_0_40px_#00ff88]"
        key={dialogueIndex}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-green-400 font-semibold mb-2">{current.speaker}</div>
        <div className="text-green-300 text-xl leading-relaxed">{current.line}</div>
      </motion.div>

      {completed && (
        <motion.button
          onClick={handleContinue}
          whileHover={{ scale: 1.05 }}
          className="mt-8 px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-lg font-semibold rounded-full shadow-[0_0_20px_#00ff88]"
        >
          🚀 Begin Mission {part}
        </motion.button>
      )}
    </motion.div>
  );
}
