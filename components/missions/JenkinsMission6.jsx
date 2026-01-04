import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function JenkinsMission6({ onComplete }) {
  const [bugs, setBugs] = useState([]);
  const [plugins, setPlugins] = useState([]);
  const [projectiles, setProjectiles] = useState([]);
  const [hp, setHp] = useState(100);
  const [wave, setWave] = useState(1);
  const [waveTransition, setWaveTransition] = useState(true); // 👈 start with transition
  const [waveStarted, setWaveStarted] = useState(false); // 👈 NEW flag
  const [completed, setCompleted] = useState(false);
  const [xp, setXp] = useState(0);

  const gridSpots = [
    { id: 1, x: -220, y: -60 },
    { id: 2, x: 220, y: -60 },
    { id: 3, x: -180, y: 180 },
    { id: 4, x: 180, y: 180 },
  ];

  const pluginTypes = [
    { name: "Git", color: "#ff4b4b" },
    { name: "Docker", color: "#00bfff" },
    { name: "Slack", color: "#c084fc" },
    { name: "JUnit", color: "#22c55e" },
  ];

  const playVoice = (file) => {
    try {
      const audio = new Audio(`/assets/voices/jenkins/${file}`);
      audio.volume = 0.8;
      audio.play().catch(() => {});
    } catch {}
  };

  // 🎬 On mount
  useEffect(() => {
    playVoice("jenkins_defense_intro.mp3");
    startWave();
  }, []);

  // ⚡ Start wave with delay & cinematic intro
  const startWave = async () => {
    setWaveTransition(true);
    setWaveStarted(false);
    playVoice("jenkins_wave_start.mp3");
    await new Promise((r) => setTimeout(r, 1500));
    spawnWave();
    setWaveTransition(false);
    setWaveStarted(true); // 👈 now the wave officially begins
  };

  // 🐞 Spawn new bugs
  const spawnWave = () => {
    const newBugs = Array.from({ length: 6 + wave * 2 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 400 - 200,
      y: -250,
      hp: 25 + wave * 10,
    }));
    setBugs(newBugs);
  };

  // 🪲 Bug movement
  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => {
      setBugs((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y + 8 }))
          .filter((b) => {
            if (b.y > 200) {
              setHp((h) => Math.max(0, h - 10));
              return false;
            }
            return true;
          })
      );
    }, 120);
    return () => clearInterval(interval);
  }, [completed]);

  // 🔫 Plugin firing
  useEffect(() => {
    if (!waveStarted || plugins.length === 0 || completed) return;
    const interval = setInterval(() => {
      setBugs((prevBugs) => {
        if (prevBugs.length === 0) return prevBugs;
        const newBugs = [...prevBugs];
        plugins.forEach((p) => {
          const target = newBugs[0];
          if (!target) return;
          const dx = target.x - p.x;
          const dy = target.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 300) {
            // projectile fired
            setProjectiles((pr) => [
              ...pr,
              {
                id: Date.now() + Math.random(),
                x: p.x,
                y: p.y,
                targetX: target.x,
                targetY: target.y,
                color: p.color,
              },
            ]);
            target.hp -= 10;
          }
        });
        return newBugs.filter((b) => b.hp > 0);
      });
    }, 500);
    return () => clearInterval(interval);
  }, [plugins, waveStarted]);

  // 🎯 Projectile motion
  useEffect(() => {
    const interval = setInterval(() => {
      setProjectiles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + (p.targetX - p.x) * 0.2,
            y: p.y + (p.targetY - p.y) * 0.2,
          }))
          .filter(
            (p) =>
              Math.abs(p.x - p.targetX) > 10 ||
              Math.abs(p.y - p.targetY) > 10
          )
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // 🧠 Win/Loss Logic
  useEffect(() => {
    if (!waveStarted) return; // 👈 don’t run before wave begins

    if (hp <= 0 && !completed) {
      setCompleted(true);
      playVoice("jenkins_defense_fail.mp3");
      return;
    }

    // Only trigger wave change if wave actually started
    if (bugs.length === 0 && !completed && hp > 0) {
      if (wave < 3) {
        playVoice("jenkins_wave_clear.mp3");
        setWave((w) => w + 1);
        startWave();
      } else {
        handleComplete();
      }
    }
  }, [bugs]);

  const handleComplete = () => {
    if (completed) return;
    setCompleted(true);
    playVoice("jenkins_defense_success.mp3");
    setXp((x) => x + 100);
    setTimeout(() => onComplete?.({ xp: 100 }), 3500);
  };

  const placePlugin = (spot) => {
    if (plugins.find((p) => p.id === spot.id)) return;
    const plugin = pluginTypes[plugins.length % pluginTypes.length];
    playVoice("jenkins_defense_place.mp3");
    setPlugins([...plugins, { ...spot, ...plugin }]);
  };

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center text-green-300 font-mono relative overflow-hidden">
      {/* Jenkins Core */}
      <motion.div
        className="relative flex items-center justify-center w-52 h-52 rounded-full border-[6px] border-green-500 shadow-[0_0_40px_#00ff88] bg-black/80"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
      >
        <img
          src="/assets/images/jenkins-core.png"
          alt="Jenkins Core"
          className="w-40 h-40 rounded-full object-cover"
        />
      </motion.div>

      {/* HP Bar */}
      <div className="absolute top-10 w-1/2 bg-gray-800 h-4 rounded-full overflow-hidden border border-green-700">
        <motion.div
          className="h-full bg-green-400"
          animate={{ width: `${hp}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Grid Spots */}
      {gridSpots.map((spot) => (
        <motion.div
          key={spot.id}
          onClick={() => placePlugin(spot)}
          className="absolute w-20 h-20 rounded-full border-2 border-green-600 flex items-center justify-center cursor-pointer hover:shadow-[0_0_20px_#00ff88]"
          style={{
            top: `calc(50% + ${spot.y}px)`,
            left: `calc(50% + ${spot.x}px)`,
          }}
        >
          {plugins.find((p) => p.id === spot.id)
            ? plugins.find((p) => p.id === spot.id).name
            : "+"}
        </motion.div>
      ))}

      {/* Bugs */}
      {bugs.map((b) => (
        <motion.div
          key={b.id}
          className="absolute w-6 h-6 rounded-full bg-red-500 shadow-[0_0_20px_#ff5555]"
          style={{
            top: `calc(50% + ${b.y}px)`,
            left: `calc(50% + ${b.x}px)`,
          }}
        />
      ))}

      {/* Projectiles */}
      {projectiles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: `calc(50% + ${p.y}px)`,
            left: `calc(50% + ${p.x}px)`,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
          }}
        />
      ))}

      {/* Wave Transition */}
      <AnimatePresence>
        {waveTransition && (
          <motion.div
            key="waveTransition"
            className="absolute inset-0 flex items-center justify-center bg-black/70 text-yellow-400 text-4xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            ⚠️ Wave {wave} Incoming!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Overlay */}
      <AnimatePresence>
        {completed && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-black/90 border border-green-600 rounded-2xl p-8 text-center shadow-[0_0_50px_#00ff88]">
              <h2 className="text-green-400 text-3xl mb-2 font-bold">
                {hp > 0 ? "Mission Complete" : "System Compromised"}
              </h2>
              <p className="text-green-200">
                {hp > 0
                  ? "All bugs neutralized. Redirecting..."
                  : "Try again to stabilize Jenkins."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
