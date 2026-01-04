import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { getLearnXp, getNextAfterLearn } from "@/data/progression";
import { jenkinsLearnScenes } from "@/data/learnScenes/jenkins";

export default function LearnScene({ topic = "jenkins", part = 1 }) {
  const router = useRouter();
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showXP, setShowXP] = useState(false);
  const [completed, setCompleted] = useState(false);

  const bgMusic = useRef(null);
  const voiceRef = useRef(null);

  const lesson = jenkinsLearnScenes.find((l) => l.id === part);
  const dialogues = lesson?.dialogues || [];
  const quiz = lesson?.quiz || null;
  const outro = lesson?.outro || null;
  const xpReward = getLearnXp(topic, part);

  // 🎵 Background music
  useEffect(() => {
    bgMusic.current = new Audio("/assets/voices/jenkins/bg_jen.mp3");
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.15;
    bgMusic.current.play().catch(() => {});
    return () => bgMusic.current?.pause();
  }, []);

  // 💬 Dialogue playback
  useEffect(() => {
  let cancelled = false;
  let audio;

  const playDialogue = async () => {
    if (dialogueIndex >= dialogues.length) {
  setTimeout(() => {
    if (quiz) {
      // 🗣️ Play quiz question voice before showing quiz
      if (quiz.quizVoice) {
        const quizAudio = new Audio(`/assets/voices/jenkins/${quiz.quizVoice}`);
        quizAudio.volume = 0.8;
        quizAudio.play().catch(() => {});
        quizAudio.onended = () => setShowQuiz(true);
      } else {
        setShowQuiz(true);
      }
    } else if (outro) {
      playOutro();
    } else {
      handleCompletion();
    }
  }, 800);
  return;
}


    const currentDialogue = dialogues[dialogueIndex];
    const audioPath = currentDialogue.voice
      ? `/assets/voices/jenkins/${currentDialogue.voice}`
      : null;

    if (audioPath) {
      audio = new Audio(audioPath);
      voiceRef.current = audio;
      setIsPlaying(true);

      // Avoid double playback by checking `cancelled`
      audio.onended = () => {
        if (!cancelled) {
          setIsPlaying(false);
          setTimeout(() => setDialogueIndex((prev) => prev + 1), 600);
        }
      };

      try {
        await audio.play();
      } catch (err) {
        console.warn("Audio playback blocked:", err);
      }
    } else {
      setTimeout(() => {
        if (!cancelled) setDialogueIndex((prev) => prev + 1);
      }, 4000);
    }
  };

  playDialogue();

  return () => {
    cancelled = true;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
  };
}, [dialogueIndex]);

  // 🎧 Outro playback
  const playOutro = () => {
    const audioPath = outro?.voice
      ? `/assets/voices/jenkins/${outro.voice}`
      : null;

    if (audioPath) {
      const outroAudio = new Audio(audioPath);
      voiceRef.current = outroAudio;
      setIsPlaying(true);
      outroAudio.play();
      outroAudio.onended = () => {
        setIsPlaying(false);
        handleCompletion();
      };
    } else {
      handleCompletion();
    }
  };

  // 🧠 Quiz logic
  const handleAnswer = async (option) => {
    if (quizAnswered) return;

    setQuizAnswered(true);
    setSelectedAnswer(option);
    const isCorrect = option === quiz.correct;

    const playSound = async (path, volume = 0.8) => {
      try {
        const audio = new Audio(path);
        audio.volume = volume;
        await new Promise((resolve) => {
          audio.onended = resolve;
          audio.play().catch(resolve);
        });
      } catch {
        return;
      }
    };

    if (isCorrect) {
      await playSound(`/assets/voices/jenkins/${quiz.correctVoice}`);
      await playSound("/assets/sounds/success.mp3", 0.5);
      playOutro();
    } else {
      await playSound(`/assets/voices/jenkins/${quiz.wrongVoice}`);
      await new Promise((res) => setTimeout(res, 1200));
      setQuizAnswered(false);
      setSelectedAnswer(null);
    }
  };

  // 🏁 Completion
  const handleCompletion = () => {
  if (completed) return;
  setCompleted(true);
  setShowQuiz(false);
  setShowXP(true);

  const prevXp = parseInt(localStorage.getItem("xp") || "0", 10);
  const totalXp = prevXp + xpReward;
  localStorage.setItem("xp", String(totalXp));
  localStorage.setItem(`learned-${topic}-${part}`, "true");
  localStorage.setItem(`learn-${topic}-${part}`, "completed");
  localStorage.setItem("current-path", `mission-${topic}-${part}`);

  setTimeout(() => {
    setShowXP(false);
    // ✅ Redirect safely using next progression path
    const nextPath = getNextAfterLearn(topic, part);
    
    // Double safety: if function fails, fallback manually
    if (nextPath) {
      window.location.href = nextPath;
    } else {
      window.location.href = `/mission/${topic}/${part}`;
    }
  }, 3500);
};


  const currentDialogue = dialogues[dialogueIndex];

  // 🎨 Unique visual per Learn
  const renderUniqueScene = () => {
    switch (part) {
      // 🧠 Learn 1: Awakening Orb
      case 1:
        return (
          <motion.div
            className="relative flex items-center justify-center w-48 h-48 rounded-full border-[6px] border-green-500 shadow-[0_0_30px_#00ff88] bg-black/80 -mt-12 mb-10"
            animate={isPlaying ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={{ repeat: isPlaying ? Infinity : 0, duration: 0.8 }}
          >
            <img
              src="/assets/images/jenkins-core.png"
              alt="Jenkins Badge"
              className="w-36 h-36 rounded-full object-cover"
            />
            <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl"></div>
          </motion.div>
        );

      // 💻 Learn 2: Terminal Console
      case 2:
  return (
    <div className="flex flex-col items-center justify-center gap-8 mt-8">
      

      {/* Jenkins Badge */}
      <motion.div
        className="relative flex items-center justify-center w-44 h-44 rounded-full border-[6px] border-green-500 shadow-[0_0_40px_#00ff88] bg-black/80 -mt-12 mb-10"
        animate={isPlaying ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={{ repeat: isPlaying ? Infinity : 0, duration: 0.8 }}
      >
        <img
          src="/assets/images/jenkins-core.png"
          alt="Jenkins Badge"
          className="w-32 h-32 rounded-full object-cover"
        />
        <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl"></div>
      </motion.div>
    </div>
  );

      // 🌐 Learn 3: Master–Agent System
    case 3:
  return (
    <div className="relative flex flex-col items-center justify-center mt-8">
      {/* Jenkins Master Node */}
      <motion.div
        className="relative flex items-center justify-center w-52 h-52 rounded-full border-[6px] border-green-500 shadow-[0_0_50px_#00ff88] bg-black/80"
        animate={isPlaying ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ repeat: isPlaying ? Infinity : 0, duration: 1 }}
      >
        <img
          src="/assets/images/jenkins-core.png"
          alt="Jenkins Master"
          className="w-40 h-40 rounded-full object-cover"
        />
        <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl"></div>
      </motion.div>

      {/* Calmly floating agents (no spin) */}
      {[
        { x: -160, y: -40 },
        { x: 150, y: -35 },
        { x: -20, y: 140 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-16 rounded-full bg-black border-2 border-green-400 shadow-[0_0_25px_#00ff88] flex items-center justify-center"
          style={{
            top: `calc(50% + ${pos.y}px)`,
            left: `calc(50% + ${pos.x}px)`,
          }}
          animate={{
            y: [pos.y, pos.y - 6, pos.y],
            x: [pos.x, pos.x + 4, pos.x],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-3 h-3 rounded-full bg-green-400 blur-[1px] shadow-[0_0_15px_#00ff88]" />
          <p className="absolute text-xs text-green-300 font-mono top-[90%]">Agent-{i + 1}</p>
        </motion.div>
      ))}

      
    </div>
  );
    // ⚙️ Learn 4: The Trigger Maze — Freestyle Jobs
case 4:
  return (
    <div className="relative flex flex-col items-center justify-center mt-10">
      {/* Jenkins Core */}
      <motion.div
        className="relative flex items-center justify-center w-52 h-52 rounded-full border-[6px] border-green-500 shadow-[0_0_50px_#00ff88] bg-black/80 -mt-12 mb-10"
        animate={isPlaying ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ repeat: isPlaying ? Infinity : 0, duration: 1 }}
      >
        <img
          src="/assets/images/jenkins-core.png"
          alt="Jenkins Core"
          className="w-40 h-40 rounded-full object-cover"
        />
        <div className="absolute inset-0 rounded-full bg-green-500/25 blur-2xl"></div>
      </motion.div>

      {/* Glowing outward pulse */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full border border-green-400/30"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Trigger Sparks (representing jobs being triggered) */}
      {["top", "left", "right"].map((dir, i) => {
        const pos = {
          top: dir === "top" ? "-120px" : "auto",
          bottom: dir === "bottom" ? "-120px" : "auto",
          left: dir === "left" ? "-160px" : dir === "right" ? "300px" : "auto",
          right: dir === "right" ? "-160px" : "auto",
        };
        return (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-green-400 rounded-full shadow-[0_0_25px_#00ff88]"
            style={pos}
            animate={{
              opacity: [0, 1, 0],
              scale: [1, 1.8, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.7,
            }}
          ></motion.div>
        );
      })}
    </div>
  );

  // 💾 Learn 5: Code Assembly Room
// 💾 Learn 5: Pipelines as Code (Cinematic Fixed)
case 5:
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Jenkins Badge (moves + pulses) */}
      <motion.div
        className="absolute flex items-center justify-center rounded-full border-[6px] border-green-500 shadow-[0_0_40px_#00ff88] bg-black/80"
        style={{ width: 180, height: 180 }}
        animate={
          showQuiz
            ? { top: "50%", left: "50%", x: "-50%", y: "-50%", scale: 1 }
            : { top: "10%", left: "8%", scale: isPlaying ? [1, 1.08, 1] : 1 }
        }
        transition={{
          repeat: isPlaying ? Infinity : 0,
          duration: 1.2,
          ease: "easeInOut",
        }}
      >
        <img
          src="/assets/images/jenkins-core.png"
          alt="Jenkins"
          className="w-[140px] h-[140px] rounded-full object-cover"
        />
        <div className="absolute inset-0 rounded-full bg-green-500/25 blur-2xl" />
      </motion.div>

      {/* Code Panel — shown while learning */}
      {!showQuiz && (
        <motion.pre
          className="mt-32 p-6 text-left text-green-300 bg-black/80 rounded-2xl border border-green-600 shadow-[0_0_36px_#00ff88] font-mono text-sm leading-6 max-w-[620px] overflow-auto whitespace-pre-wrap"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
{`pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        echo 'Building Jenkins Pipeline...'
      }
    }
    stage('Test') {
      steps {
        echo 'Running tests...'
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deploying to server...'
      }
    }
  }
}`}
        </motion.pre>
      )}

      
          </div>
  );
  // 🧪 Learn 6: Plugin Laboratory
case 6:
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden">
      {/* Jenkins Badge */}
      <motion.div
        className="absolute top-10 left-10 flex items-center justify-center w-40 h-40 rounded-full border-[6px] border-green-500 shadow-[0_0_40px_#00ff88] bg-black/80"
        animate={isPlaying ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ repeat: isPlaying ? Infinity : 0, duration: 1.2 }}
      >
        <img
          src="/assets/images/jenkins-core.png"
          alt="Jenkins Badge"
          className="w-28 h-28 rounded-full object-cover"
        />
        <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl"></div>
      </motion.div>

      {/* Plugin Laboratory Orbs */}
      {[
        { name: "Git", color: "#ff4b4b", x: -240, y: -40 },
        { name: "Slack", color: "#4da6ff", x: -100, y: -40 },
        { name: "Docker", color: "#00cfff", x: 50, y: -40 },
        { name: "JUnit", color: "#90ee90", x: 200, y: -40 },
      ].map((plugin, i) => (
        <motion.div
          key={plugin.name}
          className="absolute flex flex-col items-center justify-center text-center"
          style={{
            top: `calc(50% + ${plugin.y}px)`,
            left: `calc(50% + ${plugin.x}px)`,
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.1, 1],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center font-bold text-black"
            style={{
              backgroundColor: plugin.color,
              boxShadow: `0 0 30px ${plugin.color}`,
            }}
          >
            {plugin.name}
          </motion.div>
          <p className="text-green-400 mt-2 text-sm">{plugin.name} Plugin</p>
        </motion.div>
      ))}

      

      
      
    </div>
  );
// 🧩 Learn 7: Vault of Secrets (Jenkins Core inside Vault Door)
case 7:
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Outer Rotating Vault Door */}
      <motion.div
        className="absolute flex items-center justify-center w-[340px] h-[340px] rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-[4px] border-green-400/40 shadow-[0_0_40px_#00ff88]" />
        <img
          src="/assets/images/vault-door.png"
          alt="Vault Door"
          className="w-[320px] h-[320px] object-contain opacity-85 rounded-full"
        />
      </motion.div>

      {/* Jenkins Core (inside the Vault) */}
      <motion.div
        className="relative z-20 flex items-center justify-center w-[180px] h-[180px] rounded-full border-[5px] border-green-500 shadow-[0_0_50px_#00ff88] bg-black/90"
        animate={
          isPlaying
            ? { scale: [1, 1.07, 1], boxShadow: ["0 0 50px #00ff88", "0 0 80px #00ffaa", "0 0 50px #00ff88"] }
            : { scale: 1 }
        }
        transition={{ repeat: isPlaying ? Infinity : 0, duration: 1.5, ease: "easeInOut" }}
      >
        <img
          src="/assets/images/jenkins-core.png"
          alt="Jenkins Core"
          className="w-[130px] h-[130px] rounded-full object-cover"
        />
        <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl"></div>
      </motion.div>

      {/* Small glowing orbiting locks (symbolic security keys) */}
      {[0, 90, 180, 270].map((deg, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-green-400 rounded-full shadow-[0_0_15px_#00ff88]"
          style={{
            top: "50%",
            left: "50%",
            transform: `rotate(${deg}deg) translate(160px)`,
          }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3 + i }}
        />
      ))}

      {/* Title */}
      <motion.h2
        className="absolute top-[80%] text-green-400 text-2xl font-bold tracking-wider drop-shadow-[0_0_15px_#00ff88]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        🔐 The Vault of Secrets
      </motion.h2>

      {/* Code Panel (side, clean layout) */}
      {!showQuiz && (
        <motion.pre
          className="absolute right-[3%] top-[25%] p-6 text-left text-green-300 bg-black/75 rounded-2xl border border-green-600 shadow-[0_0_25px_#00ff88] font-mono text-sm leading-6 w-[420px] h-[400px] overflow-auto whitespace-pre-wrap"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
{`pipeline {
  agent any
  environment {
    API_KEY = credentials('my-secret-api-key')
  }
  stages {
    stage('Secure Access') {
      steps {
        withCredentials([string(credentialsId: 'api-key', variable: 'KEY')]) {
          sh 'curl -H "Authorization: $KEY" https://api.example.com'
        }
      }
    }
  }
}`}
        </motion.pre>
      )}
    </div>
  );

// 🌐 Learn 8: Debugging Arena — Testing & Reports
case 8:
  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      {/* Jenkins Badge — stays visible and pulsing */}
      <motion.div
        className="relative flex items-center justify-center w-52 h-52 rounded-full border-[6px] border-green-400 shadow-[0_0_40px_#00ff88] bg-black/80 mb-8"
        animate={isPlaying ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={{ repeat: isPlaying ? Infinity : 0, duration: 1 }}
      >
        <img
          src="/assets/images/jenkins-core.png"
          alt="Jenkins Badge"
          className="w-40 h-40 rounded-full object-cover"
        />
        <div className="absolute inset-0 rounded-full bg-green-400/25 blur-2xl"></div>
      </motion.div>

      {/* Floating Test Console Panel */}
      <motion.div
        className="relative w-[520px] bg-black/80 border border-green-500 rounded-2xl text-green-300 p-6 font-mono overflow-hidden shadow-[0_0_40px_#00ff88] text-left"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <pre className="text-green-300 whitespace-pre-wrap text-sm leading-6">
{`[INFO] Running tests...
Tests run: 45, Failures: 3, Skipped: 2
[INFO] BUILD SUCCESS
Generating JUnit reports...
Archiving test results and artifacts...
✨ Report saved to /jenkins/workspace/reports/test-results.html`}
        </pre>

        {/* Floating progress bar */}
        <motion.div
          className="absolute bottom-3 left-3 w-[90%] h-[6px] bg-green-900/60 rounded-full overflow-hidden"
          animate={{ scaleX: [0, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <motion.div className="h-full bg-green-400" />
        </motion.div>
      </motion.div>

      
    </div>
  );

  // 🚀 Learn 9: The Deployment Deck (Improved Cinematic Version)
case 9:
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.08),transparent_70%)]" />

      {/* Jenkins Core in the center */}
      <motion.div
        className="relative flex items-center justify-center rounded-full border-[6px] border-cyan-400 shadow-[0_0_80px_#00ffff] bg-black/70"
        style={{ width: 200, height: 200 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
      >
        <img
          src="/assets/images/jenkins-core.png"
          alt="Jenkins"
          className="w-[150px] h-[150px] rounded-full object-cover"
        />
        <div className="absolute inset-0 rounded-full bg-cyan-400/25 blur-2xl" />
      </motion.div>

      
      {/* Orbiting Environments */}
      {[
        { name: "Build", color: "#facc15", radius: 260, delay: 0 },
        { name: "Staging", color: "#f97316", radius: 340, delay: 1 },
        { name: "Production", color: "#22c55e", radius: 420, delay: 2 },
      ].map((env, i) => (
        <motion.div
          key={i}
          className="absolute flex flex-col items-center justify-center text-xs font-bold"
          animate={{
            rotate: 360,
            transition: { duration: 30 + i * 10, repeat: Infinity, ease: "linear" },
          }}
        >
          <motion.div
            className="rounded-full flex items-center justify-center"
            style={{
              width: 90,
              height: 90,
              backgroundColor: `${env.color}33`,
              border: `2px solid ${env.color}`,
              boxShadow: `0 0 25px ${env.color}`,
              position: "absolute",
              top: `-${env.radius}px`,
              left: "-45px",
            }}
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [`0 0 20px ${env.color}`, `0 0 40px ${env.color}`, `0 0 20px ${env.color}`],
            }}
            transition={{ repeat: Infinity, duration: 2.5, delay: env.delay }}
          >
            <span style={{ color: env.color }} className="text-sm font-bold">
              {env.name}
            </span>
          </motion.div>
        </motion.div>
      ))}

      

      {/* Deck Title */}
      <div className="absolute top-10 text-4xl font-bold text-cyan-400 drop-shadow-[0_0_20px_#00ffff]">
        The Deployment Deck
      </div>

      {/* Deck Dialogue Box */}
      <div className="absolute bottom-12 bg-black/80 border border-cyan-400 rounded-2xl px-8 py-6 text-center shadow-[0_0_50px_#00ffff] max-w-3xl">
        <p className="text-cyan-300 text-lg leading-relaxed">
          Jenkins orchestrates deployment from <span className="text-yellow-300">Build</span> →{" "}
          <span className="text-orange-400">Staging</span> →{" "}
          <span className="text-green-400">Production</span>. <br />
          Observe as the environments light up — automation in motion.
        </p>
      </div>
    </div>
  );

      default:
        return (
          <motion.div className="text-green-400 mt-10">
            ⚙️ Jenkins Core Active — awaiting next Learn theme...
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      className="w-screen h-screen flex flex-col items-center justify-center bg-black text-green-300 font-mono overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* 🧩 Unique Scene */}
      {renderUniqueScene()}

      {/* 💬 Dialogue */}
      {!showQuiz && currentDialogue && (
        <motion.div
          className="w-[80%] max-w-3xl bg-black/70 border border-green-700 rounded-2xl p-6 shadow-[0_0_40px_#00ff88]"
          key={dialogueIndex}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-center text-xl text-green-400 mb-2">{lesson.title}</h2>
          <p className="text-green-300 text-lg leading-relaxed">{currentDialogue.text}</p>
        </motion.div>
      )}

      {/* 🧠 Quiz */}
      {showQuiz && (
  <motion.div
    className="w-[85%] max-w-2xl bg-black/85 border border-yellow-500 rounded-2xl p-8 text-center shadow-[0_0_40px_#facc15] z-50 pointer-events-auto"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <h2 className="text-yellow-300 text-2xl font-bold mb-6">{quiz.question}</h2>

    <div className="flex flex-col gap-4">
      {quiz.options.map((opt, i) => (
        <motion.button
          key={i}
          onClick={() => handleAnswer(opt)}
          disabled={quizAnswered}
          whileHover={!quizAnswered ? { scale: 1.05 } : {}}
          className={`px-6 py-3 rounded-full font-bold text-lg border transition-all
            ${
              !quizAnswered
                ? "bg-yellow-800 hover:bg-yellow-700 text-yellow-200 border-yellow-400"
                : opt === selectedAnswer
                ? opt === quiz.correct
                  ? "bg-green-600 text-white border-green-400"
                  : "bg-red-600 text-white border-red-400"
                : "bg-gray-700 text-gray-400 border-gray-600"
            }`}
        >
          {opt}
        </motion.button>
      ))}
    </div>
  </motion.div>
)}

      {/* XP */}
      {showXP && (
        <motion.div
          className="absolute bottom-20 text-4xl font-bold text-green-400 drop-shadow-[0_0_25px_#00ff88]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          +{xpReward} XP Earned!
        </motion.div>
      )}
    </motion.div>
  );
}
