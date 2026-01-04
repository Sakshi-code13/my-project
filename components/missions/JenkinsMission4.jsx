// components/missions/JenkinsMission4.jsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getLearnXp } from "@/data/progression";

export default function JenkinsMission4({ topic = "jenkins", part = 4 }) {
  const scenarios = [
    {
      id: "scm_poll",
      title: "Repo updates constantly — build automatically when code is pushed.",
      voice: "trigger2_scm_poll.mp3",
      options: ["Build periodically", "Poll SCM", "Build after another job", "Manual trigger"],
      correct: "Poll SCM",
      correctVoice: "trigger2_correct_scm.mp3",
      wrongVoice: "trigger2_wrong.mp3",
    },
    {
      id: "chained_job",
      title: "Job B should run only after Job A finishes successfully.",
      voice: "trigger2_chain.mp3",
      options: ["Manual trigger", "Poll SCM", "Build after another job", "Build periodically"],
      correct: "Build after another job",
      correctVoice: "trigger2_correct_chain.mp3",
      wrongVoice: "trigger2_wrong.mp3",
    },
    {
      id: "cron",
      title: "You want nightly builds at midnight.",
      voice: "trigger2_cron.mp3",
      options: ["Build periodically", "Poll SCM", "Manual trigger", "Build after another job"],
      correct: "Build periodically",
      correctVoice: "trigger2_correct_cron.mp3",
      wrongVoice: "trigger2_wrong.mp3",
    },
  ];

  const xpReward = getLearnXp ? getLearnXp(topic, part) : 25;
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const voiceRef = useRef(null);
  const current = scenarios[scenarioIndex];

  const playAudio = (relPath, volume = 0.9) =>
    new Promise((resolve) => {
      if (!relPath) return resolve();
      const path = `/assets/voices/jenkins/${relPath}`;
      try {
        const a = new Audio(path);
        a.volume = volume;
        voiceRef.current = a;
        a.onended = () => resolve();
        a.play().catch(() => setTimeout(resolve, 600));
        setTimeout(resolve, 8000);
      } catch {
        resolve();
      }
    });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setSelected(null);
      setLocked(false);
      await new Promise((r) => setTimeout(r, 300));
      if (cancelled) return;
      if (current?.voice) {
        setIsPlaying(true);
        await playAudio(current.voice);
        setIsPlaying(false);
      }
    })();
    return () => {
      cancelled = true;
      if (voiceRef.current) {
        voiceRef.current.pause();
        voiceRef.current.src = "";
      }
    };
  }, [scenarioIndex]);

  const handleOption = async (option) => {
    if (locked) return;
    setSelected(option);
    setLocked(true);

    const isCorrect = option === current.correct;
    setIsPlaying(true);

    if (isCorrect) {
      await playAudio(current.correctVoice);
      await playAudio("/success.mp3", 0.5).catch(() => {});
      setIsPlaying(false);
      setShowXP(true);

      const prevXp = parseInt(localStorage.getItem("xp") || "0", 10);
      localStorage.setItem("xp", String(prevXp + xpReward));
      localStorage.setItem(`mission-${topic}-${part}`, "completed");

      setTimeout(() => setShowXP(false), 1500);
      setTimeout(() => {
        if (scenarioIndex < scenarios.length - 1) {
          setScenarioIndex((s) => s + 1);
          setSelected(null);
          setLocked(false);
        } else {
          setCompleted(true);
          setTimeout(() => {
            window.location.href = `/learn/jenkins/5`;
          }, 1300);
        }
      }, 900);
    } else {
      await playAudio(current.wrongVoice);
      setIsPlaying(false);
      setTimeout(() => {
        setSelected(null);
        setLocked(false);
      }, 900);
    }
  };

  return (
    <div className="w-screen h-screen bg-black text-green-300 font-mono flex flex-col items-center justify-start pb-16 relative overflow-hidden">
      {/* Top badge */}
      <div className="mt-8 flex flex-col items-center">
        <div
          className={`relative flex items-center justify-center w-48 h-48 rounded-full border-[6px] border-green-500 shadow-[0_0_40px_#00ff88] bg-black/80 ${
            isPlaying ? "animate-pulse" : ""
          }`}
        >
          <img
            src="/assets/images/jenkins-core.png"
            alt="Jenkins Badge"
            className="w-36 h-36 rounded-full object-cover"
          />
          <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl pointer-events-none" />
        </div>

        <h1 className="mt-6 text-yellow-300 text-xl font-semibold">
          [MISSION_4] The Trigger Maze
        </h1>
        <p className="text-yellow-300/90 mt-2">Choose the right trigger for each scenario.</p>
      </div>

      {/* scenario box */}
      <div className="mt-6 bg-black/80 border border-green-700 rounded-2xl p-6 shadow-[0_0_40px_#00ff88]">
        <h2 className="text-2xl text-green-400 text-center font-semibold mb-3">
          {current.title}
        </h2>

        {/* trigger cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {current.options.map((opt, i) => {
            const isSel = selected === opt;
            const correct = opt === current.correct;
            return (
              <motion.button
                key={i}
                onClick={() => handleOption(opt)}
                whileTap={{ scale: 0.98 }}
                className={`w-56 h-20 rounded-xl border-2 flex items-center justify-center text-lg font-semibold transition-shadow ${
                  !locked
                    ? "bg-black/70 border-green-600 text-green-200 hover:shadow-[0_0_24px_#00ff88]"
                    : isSel
                    ? correct
                      ? "bg-green-600 text-white border-green-400 shadow-[0_0_30px_#00ff88]"
                      : "bg-red-700 text-white border-red-500 shadow-[0_0_20px_#ff6b6b]"
                    : "bg-black/60 text-green-200 border-green-600/50"
                }`}
                disabled={locked}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>

        {/* action / status */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-green-300/90 text-sm">
            Scenario {scenarioIndex + 1} / {scenarios.length}
          </div>
          <div>
            <motion.button
              onClick={() => {
                if (locked) return;
                setScenarioIndex((s) => Math.min(s + 1, scenarios.length - 1));
                setSelected(null);
              }}
              whileHover={{ scale: 1.02 }}
              className="px-6 py-2 rounded-full bg-black/60 border border-green-600 text-green-200"
            >
              Next scenario
            </motion.button>
          </div>
        </div>
      </div>

      {/* XP popup */}
      {showXP && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-3xl font-bold text-green-400 drop-shadow-[0_0_25px_#00ff88]"
        >
          +{xpReward} XP
        </motion.div>
      )}

      {/* Completion overlay */}
      {completed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-black/90 border border-green-600 rounded-2xl p-8 text-center shadow-[0_0_50px_#00ff88]">
            <h3 className="text-2xl text-green-300 font-bold mb-2">Mission Complete</h3>
            <p className="text-green-200">Redirecting to next Learn...</p>
          </div>
        </div>
      )}
    </div>
  );
}
