import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DialogueBox({ text, onComplete }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (onComplete) setTimeout(onComplete, 500);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <motion.div
      className="bg-black/70 border border-green-500 rounded-xl px-6 py-4 text-green-300 text-lg shadow-[0_0_15px_#00ff88]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {displayed}
    </motion.div>
  );
}
