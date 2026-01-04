import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getNextAfterLearn } from "@/data/progression";

export default function JenkinsMission3() {
  const [agents, setAgents] = useState([]);
  const [rule, setRule] = useState(null);
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const voiceRef = useRef(null);

  const osTypes = ["Linux", "Windows", "Ubuntu", "CentOS", "macOS"];
  const rules = [
    {
      text: "Connect Linux agents with latency below 60ms.",
      check: (a) => a.os === "Linux" && a.latency < 60,
      voice: "node_rule1.mp3",
    },
    {
      text: "Connect Windows agents with latency above 40ms.",
      check: (a) => a.os === "Windows" && a.latency > 40,
      voice: "node_rule2.mp3",
    },
    {
      text: "Connect agents whose names start with letter A.",
      check: (a) => a.name.startsWith("A"),
      voice: "node_rule3.mp3",
    },
    {
      text: "Connect all Ubuntu or CentOS agents.",
      check: (a) => ["Ubuntu", "CentOS"].includes(a.os),
      voice: "node_rule4.mp3",
    },
  ];

  // Generate random agents + rule
  useEffect(() => {
    const chosenRule = rules[Math.floor(Math.random() * rules.length)];
    setRule(chosenRule);

    const generatedAgents = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: ["Agent-A", "Agent-B", "Agent-C", "Agent-D", "Agent-E"][i],
      os: osTypes[Math.floor(Math.random() * osTypes.length)],
      latency: Math.floor(Math.random() * 80) + 20,
    }));

    setAgents(generatedAgents);

    playVoice("node_intro.mp3", () => {
      playVoice(chosenRule.voice);
    });
  }, []);

  const playVoice = (file, onEnd) => {
    const audio = new Audio(`/assets/voices/jenkins/${file}`);
    voiceRef.current = audio;
    setVoicePlaying(true);
    audio.play();
    audio.onended = () => {
      setVoicePlaying(false);
      if (onEnd) onEnd();
    };
  };

  const toggleSelect = (id) => {
    if (result) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const correctAgents = agents.filter(rule.check);
    const selectedAgents = agents.filter((a) => selected.includes(a.id));

    const isCorrect =
      selectedAgents.length === correctAgents.length &&
      selectedAgents.every((a) => correctAgents.includes(a));

    if (isCorrect) {
      playVoice("node_success.mp3", () => {
        setResult("success");
        playVoice("node_complete.mp3");
        setTimeout(() => {
          window.location.href = "/learn/jenkins/4";
        }, 6000);
      });
    } else {
      playVoice("node_fail.mp3");
      setResult("fail");
      setTimeout(() => setResult(null), 2000);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black text-green-300 font-mono overflow-hidden relative">
      {/* Jenkins Core */}
      <motion.div
        className="relative flex items-center justify-center w-48 h-48 rounded-full border-[6px] border-green-500 shadow-[0_0_40px_#00ff88] bg-black/80 mb-12"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <img
          src="/assets/images/jenkins-core.png"
          alt="Jenkins Core"
          className="w-36 h-36 rounded-full object-cover"
        />
      </motion.div>

      {/* Rule Display */}
      {rule && (
        <div className="text-center mb-6 text-yellow-300 text-lg">
          <p>[MISSION_3] Node Connection Challenge</p>
          <p className="text-yellow-400 mt-2">Rule: {rule.text}</p>
        </div>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-3 gap-6 max-w-3xl">
        {agents.map((a) => (
          <motion.div
            key={a.id}
            onClick={() => toggleSelect(a.id)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selected.includes(a.id)
                ? "border-green-400 bg-green-900/40 shadow-[0_0_20px_#00ff88]"
                : "border-green-700 bg-black/60 hover:bg-green-900/10"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-green-400 font-bold">{a.name}</p>
            <p className="text-sm text-green-300">OS: {a.os}</p>
            <p className="text-sm text-green-300">Latency: {a.latency} ms</p>
          </motion.div>
        ))}
      </div>

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        className="mt-10 px-6 py-3 bg-green-700 hover:bg-green-600 text-white rounded-full border border-green-400 shadow-[0_0_20px_#00ff88]"
        whileHover={{ scale: 1.05 }}
      >
        Establish Connection
      </motion.button>

      {/* Result Feedback */}
      {result && (
        <motion.div
          className={`absolute bottom-24 text-3xl font-bold ${
            result === "success"
              ? "text-green-400"
              : "text-red-500 drop-shadow-[0_0_20px_#ff0000]"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {result === "success"
            ? "[LINK_ESTABLISHED] All nodes online."
            : "[ERROR] Connection failed."}
        </motion.div>
      )}
    </div>
  );
}
