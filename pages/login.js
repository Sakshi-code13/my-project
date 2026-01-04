// /pages/login.js
"use client";

import { useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Login() {
  const bgMusic = useRef(null);

  // 🎵 Play background music safely
  useEffect(() => {
    bgMusic.current = new Audio("/assets/sounds/login_theme.mp3");
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.4;
    bgMusic.current.play().catch(() => {
      console.warn("Autoplay blocked — waiting for user gesture to start music.");
    });

    return () => {
      bgMusic.current?.pause();
      bgMusic.current = null;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-mono relative overflow-hidden">
      {/* ✨ Holographic grid background */}
      <motion.div
        className="absolute inset-0 bg-[url('/assets/images/holo_grid.png')] bg-cover opacity-20"
        animate={{ opacity: [0.15, 0.00, 0.15] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />

      {/* 🔆 Glowing aura effect */}
      <motion.div
        className="absolute -top-40  w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />

      {/* 🖼️ Center content */}
      <div className="z-10 text-center">
        <Image
          src="/Logo.png"
          alt="DevOpsQuest Logo"
          width={180}
          height={180}
          className="mx-auto mb-6 drop-shadow-[0_0_25px_#8800ff]"
        />
        <h1 className="text-4xl font-extrabold text-neon-400 mb-2 tracking-wider">
          DEVOPSQUEST
        </h1>
        <p className="text-gray-400 mb-8 italic">
          Level up your DevOps skills — one quest at a time.
        </p>

        {/* 🔐 Sign-in Buttons */}
        <div className="flex flex-col items-center gap-4">
          <motion.button
            onClick={() => signIn("google", { callbackUrl: "/select" })}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-[0_0_20px_#ff4d4d]"
          >
            <img
              src="/assets/icons/Google-logo.jpg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </motion.button>

          <motion.button
            onClick={() => signIn("github", { callbackUrl: "/select" })}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-semibold shadow-[0_0_20px_#999]"
          >
            <img
              src="/assets/icons/Github-logo.jpg"
              alt="GitHub"
              className="w-5 h-5"
            />
            Sign in with GitHub
          </motion.button>
        </div>

        
       
      </div>

      {/* 🎵 Manual music start button (if autoplay is blocked) */}
      <button
        onClick={() => bgMusic.current?.play()}
        className="absolute bottom-6 right-6 text-sm text-green-400 hover:text-green-200"
      >
        🔊 Play Music
      </button>
    </div>
  );
}
