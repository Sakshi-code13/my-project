// components/missions/JenkinsMission5.jsx
import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function JenkinsMission5({ onComplete }) {
  const [assembled, setAssembled] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [hovering, setHovering] = useState(false);
  const audioRef = useRef(null);

  const correctOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const blocks = [
    { id: "1", code: "pipeline {" },
    { id: "2", code: "  agent any" },
    { id: "3", code: "  stages {" },
    { id: "4", code: "      stage('Build') {" },
    { id: "5", code: "          steps {" },
    { id: "6", code: "              echo 'Building Jenkins Pipeline...'" },
    { id: "7", code: "          }" },
    { id: "8", code: "      }" },
    { id: "9", code: "  }" },
    { id: "10", code: "}" },
  ];

  const playVoice = (path) => {
    const a = new Audio(path);
    a.volume = 0.85;
    a.play().catch(() => {});
  };

  const handleDrop = (id) => {
    if (isComplete) return;

    const nextIndex = assembled.length;
    if (id === correctOrder[nextIndex]) {
      setAssembled((prev) => [...prev, id]);
      setFeedback("correct");
      playVoice("/assets/voices/jenkins/pipeline_success.mp3");

      if (assembled.length + 1 === correctOrder.length) {
        setIsComplete(true);
        setTimeout(() => {
          onComplete({ xp: 50 });
        }, 2500);
      }
    } else {
      setFeedback("wrong");
      playVoice("/assets/voices/jenkins/pipeline_error.mp3");
      setTimeout(() => setFeedback(null), 1200);
    }
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("blockId", id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setHovering(true);
  };

  const handleDragLeave = () => setHovering(false);

  const handleDropEvent = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("blockId");
    setHovering(false);
    if (id) handleDrop(id);
  };

  return (
    <div className="w-screen h-screen bg-black text-green-300 font-mono flex flex-col items-center justify-center relative overflow-hidden">
      {/* Jenkins Badge */}
      <motion.div
        className="absolute top-10 left-10 w-40 h-40 rounded-full border-[6px] border-green-500 shadow-[0_0_40px_#00ff88] flex items-center justify-center bg-black/80"
        animate={{
          scale:
            feedback === "wrong"
              ? [1, 0.85, 1]
              : isComplete
              ? [1, 1.15, 1]
              : [1, 1.05, 1],
        }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        <img
          src="/assets/images/jenkins-core.png"
          alt="Jenkins"
          className="w-28 h-28 rounded-full object-cover"
        />
      </motion.div>

      {/* Title */}
      <h1 className="text-2xl text-green-400 mt-4 mb-2">
        [MISSION_5] The Code Assembly Room
      </h1>
      <p className="text-green-200 mb-8 text-center px-4">
        Drag the correct Jenkinsfile blocks into the glowing assembly console — in the right order.
      </p>

      {/* Draggable Code Blocks */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mb-12">
        {blocks.map((b) => (
          <motion.div
            key={b.id}
            draggable={!assembled.includes(b.id) && !isComplete}
            onDragStart={(e) => handleDragStart(e, b.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`cursor-grab select-none px-5 py-3 rounded-lg border text-left font-mono transition-all
              ${
                assembled.includes(b.id)
                  ? "bg-green-800 border-green-400 text-white opacity-60"
                  : "bg-black/60 border-green-600 hover:shadow-[0_0_20px_#00ff88]"
              }`}
          >
            {b.code}
          </motion.div>
        ))}
      </div>

      {/* Assembly Console (Drop Area) */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDropEvent}
        className={`w-[80%] max-w-2xl min-h-[250px] p-6 text-left text-green-300 bg-black/80 rounded-2xl border-2 ${
          hovering
            ? "border-green-400 shadow-[0_0_40px_#00ff88]"
            : "border-green-600 shadow-[0_0_25px_#00ff88]"
        }`}
      >
        <pre className="text-sm leading-6 whitespace-pre-wrap">
          {assembled
            .map((id) => blocks.find((b) => b.id === id)?.code)
            .join("\n")}
        </pre>
        {!assembled.length && (
          <p className="text-green-400/60 text-center mt-8">
            🧩 Drop code blocks here to assemble your pipeline
          </p>
        )}
      </motion.div>

      {/* Feedback Messages */}
      {feedback === "wrong" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-24 text-red-400 text-lg font-semibold"
        >
          ❌ Invalid sequence — Jenkinsfile structure error.
        </motion.div>
      )}
      {feedback === "correct" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-24 text-green-400 text-lg font-semibold"
        >
          ✅ Code accepted — continue building...
        </motion.div>
      )}

      {/* Completion Popup */}
      {isComplete && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute bottom-16 text-3xl font-bold text-green-400 drop-shadow-[0_0_25px_#00ff88]"
        >
          🎉 Pipeline Complete! +50 XP
        </motion.div>
      )}
    </div>
  );
}
