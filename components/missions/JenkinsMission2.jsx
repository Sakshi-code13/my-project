"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

export default function JenkinsMission2() {
  const router = useRouter();
  const [stage, setStage] = useState(0); // 0 = intro, 1-3 = stages
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [xp, setXp] = useState(0);

  const voiceRef = useRef(null);

  const stages = [
    {
      id: 1,
      title: "Java Runtime Terminal",
      question: "To awaken Jenkins, what must be installed first?",
      commands: [
        "$ sudo apt install python3",
        "$ sudo apt install openjdk-17-jdk",
        "$ sudo apt install docker-ce",
      ],
      correct: "$ sudo apt install openjdk-17-jdk",
      voice: "terminal_q1.mp3",
    },
    {
      id: 2,
      title: "Jenkins Service Core",
      question: "Which command awakens the Jenkins service?",
      commands: [
        "$ jenkins --start",
        "$ java -jar jenkins.war",
        "$ run jenkins.sh",
      ],
      correct: "$ java -jar jenkins.war",
      voice: "terminal_q2.mp3",
    },
    {
      id: 3,
      title: "Build Job Console",
      question: "What’s the first job type you must create?",
      commands: [
        "$ create pipeline",
        "$ create freestyle_project",
        "$ create matrix_build",
      ],
      correct: "$ create freestyle_project",
      voice: "terminal_q3.mp3",
    },
  ];

  // 🎧 Function to safely play one voice at a time
  const playVoice = (file, delay = 0) => {
    if (!file) return;
    setTimeout(() => {
      if (voiceRef.current) {
        voiceRef.current.pause();
        voiceRef.current.currentTime = 0;
      }
      const audio = new Audio(`/assets/voices/jenkins/${file}`);
      voiceRef.current = audio;
      setIsSpeaking(true);
      audio.play();
      audio.onended = () => setIsSpeaking(false);
    }, delay);
  };

  // 🚀 Start Mission
  useEffect(() => {
    playVoice("terminal_intro.mp3");
    const timer = setTimeout(() => {
      setStage(1);
      playVoice(stages[0].voice);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // 🧠 Answer selection
  const handleCommand = (cmd) => {
    if (answered) return;
    setAnswered(true);
    setSelected(cmd);

    const current = stages[stage - 1];
    const isCorrect = cmd === current.correct;

    if (isCorrect) {
      playVoice("terminal_correct.mp3");
      setXp((prev) => prev + 30);

      setTimeout(() => {
        if (stage < stages.length) {
          setStage((prev) => prev + 1);
          setAnswered(false);
          setSelected(null);
          playVoice(stages[stage].voice);
        } else {
          playVoice("terminal_complete.mp3");
          setCompleted(true);
          setTimeout(() => {
            playVoice("terminal_reward.mp3");
            handleCompletion();
          }, 3000);
        }
      }, 2000);
    } else {
      playVoice("terminal_wrong.mp3");
      setTimeout(() => {
        setAnswered(false);
        setSelected(null);
      }, 2000);
    }
  };

  // 🏁 Completion
  const handleCompletion = () => {
    const prevXp = parseInt(localStorage.getItem("xp") || "0", 10);
    const totalXp = prevXp + xp;
    localStorage.setItem("xp", String(totalXp));
    localStorage.setItem("mission-jenkins-2", "completed");
    setTimeout(() => router.push("/learn/jenkins/3"), 3000);
  };

  const current = stages[stage - 1];

  return (
    <motion.div
      className="w-screen h-screen flex flex-col items-center justify-center bg-black text-green-400 font-mono relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        backgroundImage: "url('/assets/backgrounds/bg-core-terminal.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Glowing terminal overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-black to-black opacity-90" />

      {/* Jenkins badge */}
      <motion.div
        className="relative flex items-center justify-center w-40 h-40 rounded-full border-[5px] border-green-500 shadow-[0_0_25px_#00ff88] bg-black/80 -mt-12 mb-8"
        animate={isSpeaking ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={{ repeat: isSpeaking ? Infinity : 0, duration: 0.8 }}
      >
        <img
          src="/assets/images/jenkins-core.png"
          alt="Jenkins"
          className="w-28 h-28 rounded-full object-cover"
        />
        <div className="absolute inset-0 rounded-full bg-green-500/25 blur-2xl"></div>
      </motion.div>

      <h2 className="text-3xl font-bold mb-4 text-center">Jenkins Core Terminal</h2>

      {/* 🖥️ Terminal window */}
{!completed && current && (
  <motion.div
    className="relative w-[85%] max-w-3xl bg-black/90 border border-green-400 rounded-xl p-6 text-green-300 shadow-[0_0_50px_#00ff88] z-50"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="text-green-200 text-lg mb-6">
      <span className="text-green-400 font-semibold">
        [TERMINAL_{current.id}]:
      </span>{" "}
      {current.question}
    </div>

    <div className="flex flex-col gap-4">
      {current.commands.map((cmd, i) => (
        <motion.button
          key={i}
          onClick={() => handleCommand(cmd)}
          disabled={answered}
          whileHover={!answered ? { scale: 1.05 } : {}}
          className={`px-6 py-3 text-left rounded-lg font-mono border-2 transition-all duration-200 focus:outline-none
            ${
              !answered
                ? "bg-green-950 hover:bg-green-900 text-green-200 border-green-400 cursor-pointer"
                : cmd === selected
                ? cmd === current.correct
                  ? "bg-green-600 text-white border-green-300"
                  : "bg-red-600 text-white border-red-400"
                : "bg-gray-800 text-gray-400 border-gray-600 cursor-not-allowed"
            }`}
        >
          <span className="text-green-300">{cmd}</span>
        </motion.button>
      ))}
    </div>

    <div className="mt-6 text-sm text-green-400 font-light animate-pulse select-none">
      {"› Awaiting input..."}
    </div>
  </motion.div>
)}


      {/* ✅ Completion Screen */}
      {completed && (
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h3 className="text-3xl text-green-400 font-bold mb-2">
            ✅ Core Systems Calibrated!
          </h3>
          <p className="text-xl text-green-300">+{xp} XP Earned</p>
          <p className="mt-2 text-green-500">Redirecting to Learn 3...</p>
        </motion.div>
      )}
    </motion.div>
  );
}
