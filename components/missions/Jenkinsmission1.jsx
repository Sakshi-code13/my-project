import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function JenkinsMission1({ onComplete = () => {} }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [activated, setActivated] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);

  const voiceRef = useRef(null);

  const reactors = [
    {
      id: 1,
      question: "Which part of CI/CD ensures integration happens automatically?",
      options: ["Deploy", "Test", "Build"],
      correct: "Build",
      questionVoice: "reactor1_question.mp3",
      correctVoice: "reactor_correct.mp3",
      wrongVoice: "reactor_wrong.mp3",
    },
    {
      id: 2,
      question: "Which stage in CI/CD verifies code correctness automatically?",
      options: ["Monitor", "Test", "Deploy"],
      correct: "Test",
      questionVoice: "reactor2_question.mp3",
      correctVoice: "(reuse) reactor_correct.mp3",
      wrongVoice: "(reuse) reactor_wrong.mp3",
    },
    {
      id: 3,
      question: "Which stage pushes code to the production environment?",
      options: ["Build", "Deploy", "Lint"],
      correct: "Deploy",
      questionVoice: "reactor3_question.mp3",
      correctVoice: "((reuse) reactor_correct.mp3",
      wrongVoice: "reactor_wrong.mp3",
    },
  ];

  const current = reactors[step];

  /** 🎧 Safe audio playback helper **/
  /** 🎧 Fully persistent voice playback (waits till end) **/
const playVoiceFully = async (filename, volume = 0.85) => {
  return new Promise((resolve, reject) => {
    try {
      if (!filename) return resolve();

      // stop previous voice safely
      if (voiceRef.current) {
        voiceRef.current.pause();
        voiceRef.current.currentTime = 0;
      }

      const audio = new Audio(`/assets/voices/jenkins/${filename}`);
      voiceRef.current = audio;
      audio.volume = volume;
      setIsSpeaking(true);

      audio.onended = () => {
        setIsSpeaking(false);
        resolve();
      };
      audio.onerror = (err) => {
        console.warn("Audio error:", err);
        resolve(); // skip error
      };

      audio.play().catch((err) => {
        console.warn("Audio blocked:", err);
        resolve();
      });
    } catch (e) {
      console.error("Voice play failed:", e);
      resolve();
    }
  });
};

  /** 🚀 Intro Sequence **/
  useEffect(() => {
  const playIntro = async () => {
    await playVoiceFully("reactor_intro.mp3");
    await playVoiceFully("reactor_instructions.mp3");
    setShowQuiz(true);
    await playVoiceFully(reactors[0].questionVoice);
  };
  playIntro();
}, []);

  /** 🧩 Handle Answer **/
  const handleAnswer = async (option) => {
  if (selected !== null) return;
  setSelected(option);

  const correct = option === current.correct;

  if (correct) {
    await playVoiceFully(current.correctVoice);
    setActivated((prev) => [...prev, current.id]);

    setTimeout(async () => {
      if (step < reactors.length - 1) {
        setStep(step + 1);
        setSelected(null);
        await playVoiceFully(reactors[step + 1].questionVoice);
      } else {
        setXpEarned(true);
        await playVoiceFully("reactor_complete.mp3");
        await playVoiceFully("reactor_reward.mp3");
        setTimeout(() => onComplete && onComplete({ xp: 100 }), 1000);
      }
    }, 400);
  } else {
    await playVoiceFully(current.wrongVoice);
    setTimeout(() => setSelected(null), 600);
  }
};


  return (
    <div className="relative w-screen h-screen bg-black text-green-300 font-mono overflow-hidden flex flex-col items-center justify-start">
      {/* Jenkins Badge */}
      <motion.div
        className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center justify-center w-44 h-44 rounded-full border-[8px] border-green-500 shadow-[0_0_40px_#00ff88] bg-black/80 pointer-events-none select-none z-10"
        animate={isSpeaking ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ repeat: isSpeaking ? Infinity : 0, duration: 1 }}
      >
        <img
          src="/assets/images/jenkins-core.png"
          alt="Jenkins Badge"
          className="w-32 h-32 rounded-full object-cover select-none"
          draggable="false"
        />
        <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl"></div>
      </motion.div>

      {/* Reactors */}
      <div className="absolute top-[17rem] left-1/2 -translate-x-1/2 flex gap-16 z-5 pointer-events-none">
        {[1, 2, 3].map((id) => (
          <motion.div
            key={id}
            className={`w-28 h-28 rounded-full flex items-center justify-center border-4 text-lg font-bold ${
              activated.includes(id)
                ? "border-green-400 text-green-300 shadow-[0_0_25px_#00ff88]"
                : id === step + 1
                ? "border-yellow-400 text-yellow-300"
                : "border-gray-700 text-gray-500"
            }`}
          >
            R{id}
          </motion.div>
        ))}
      </div>

      {/* Quiz */}
      {showQuiz && (
        <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[85%] max-w-3xl bg-black/80 border border-green-700 rounded-2xl p-8 shadow-[0_0_40px_#00ff88] text-center z-[100] pointer-events-auto">
          <h2 className="text-2xl text-green-400 font-semibold mb-4">
            {`Reactor ${current.id}`}
          </h2>
          <p className="text-green-200 text-lg mb-6">{current.question}</p>

          <div className="flex flex-col gap-4 items-center">
            {current.options.map((opt, i) => (
              <motion.button
                key={i}
                onClick={() => handleAnswer(opt)}
                whileHover={{ scale: 1.05 }}
                disabled={selected !== null}
                className={`px-6 py-3 w-[70%] max-w-md rounded-full font-bold text-lg border transition-all duration-300 ${
                  selected
                    ? opt === current.correct
                      ? "bg-green-600 text-white border-green-400"
                      : opt === selected
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-gray-700 text-gray-400 border-gray-600"
                    : "bg-green-900/40 hover:bg-green-800 text-green-200 border-green-600"
                }`}
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* XP popup */}
      {xpEarned && (
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 text-4xl font-bold text-green-400 drop-shadow-[0_0_25px_#00ff88] z-[200]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          +100 XP Earned!
        </motion.div>
      )}
    </div>
  );
}
