import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function JenkinsMission7({ onComplete }) {
  const [level, setLevel] = useState(1);
  const [message, setMessage] = useState("Decrypt the vault by listening to the tones...");
  const [sequence, setSequence] = useState([]);
  const [failed, setFailed] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [isPlayingHint, setIsPlayingHint] = useState(false);

  const correctPatterns = {
    1: [1, 3, 4],
    2: [2, 3, 5, 1],
    3: [4, 2, 6, 3, 5],
  };

  // 🎧 Intro
  useEffect(() => {
    const intro = new Audio("/assets/voices/jenkins/vault_intro.mp3");
    intro.volume = 0.7;
    intro.play().catch(() => {});
  }, []);

  const playBeep = (id) => {
    const beep = new Audio(`/assets/voices/jenkins/beep${id}.wav`);
    beep.volume = 0.6;
    beep.play().catch(() => {});
  };

  // 🔊 Play sequence hint
  const playHint = async () => {
    if (isPlayingHint) return;
    setIsPlayingHint(true);
    const seq = correctPatterns[level];
    setMessage("🔊 Playing hint... Listen carefully.");

    for (let i = 0; i < seq.length; i++) {
      playBeep(seq[i]);
      await new Promise((r) => setTimeout(r, 800));
    }

    setTimeout(() => {
      setMessage("Now reproduce the sequence!");
      setIsPlayingHint(false);
    }, 500);
  };

  const handleClick = (id) => {
    if (isPlayingHint || failed || unlocked) return;

    const correct = correctPatterns[level];
    const nextSeq = [...sequence, id];
    setSequence(nextSeq);

    const isPrefixCorrect = correct
      .slice(0, nextSeq.length)
      .every((v, i) => v === nextSeq[i]);

    if (!isPrefixCorrect) {
      setFailed(true);
      setMessage("❌ Incorrect tone pattern! Resetting...");
      new Audio("/assets/voices/jenkins/beep_fail.wav").play();
      setTimeout(() => {
        setFailed(false);
        setSequence([]);
        setMessage("Try again — or listen to the tones once more.");
      }, 1500);
      return;
    }

    // ✅ Full correct sequence
    if (nextSeq.length === correct.length) {
      new Audio("/assets/voices/jenkins/beep_success.wav").play();
      setSequence([]);
      if (level < 3) {
        setMessage(`✅ Vault layer ${level} unlocked! Proceeding...`);
        setTimeout(() => {
          setLevel((l) => l + 1);
          setMessage(`Vault Layer ${level + 1} — stronger encryption.`);
        }, 1500);
      } else {
        setUnlocked(true);
        setMessage("🟢 All vaults decrypted — escaping the vault...");
        new Audio("/assets/voices/jenkins/vault_complete.mp3").play();
        setTimeout(() => onComplete({ xp: 200 }), 3500);
      }
    }
  };

  const grid = [1, 2, 3, 4, 5, 6];

  return (
    <div className="h-screen w-screen bg-black text-green-400 flex flex-col items-center justify-center font-mono">
      {/* Vault Door */}
      <motion.div
        className={`w-64 h-64 rounded-full flex items-center justify-center border-[6px] bg-black/80 shadow-[0_0_40px_#00ff88] mb-10 ${
          failed ? "border-red-500 shadow-[0_0_40px_#ff0000]" : "border-green-500"
        }`}
        animate={unlocked ? { rotate: 360 } : failed ? { scale: [1, 1.1, 1] } : {}}
        transition={{
          duration: unlocked ? 5 : 0.6,
          repeat: unlocked ? Infinity : 0,
          ease: "linear",
        }}
      >
        <img
          src="/assets/images/vault-door.png"
          alt="Vault"
          className="w-48 h-48 rounded-full opacity-90"
        />
      </motion.div>

      {/* Status */}
      <motion.p
        key={message}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4 text-lg"
      >
        {message}
      </motion.p>

      {/* Hint Button */}
      <button
        onClick={playHint}
        disabled={isPlayingHint}
        className="mb-6 px-6 py-2 rounded-full bg-green-700 text-white border border-green-400 hover:bg-green-600 transition"
      >
        🔊 Play Tone Hint
      </button>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-6">
        {grid.map((id) => (
          <motion.button
            key={id}
            onClick={() => handleClick(id)}
            whileTap={{ scale: 0.9 }}
            className={`w-16 h-16 rounded-full border-2 font-bold text-lg ${
              failed
                ? "border-red-500 text-red-400"
                : "border-green-400 text-green-200 hover:bg-green-400/20"
            }`}
          >
            {id}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
