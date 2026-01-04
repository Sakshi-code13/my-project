// components/missions/JenkinsMission9.jsx
import { useRouter } from "next/router"; // 👈 make sure this is at the top

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * JenkinsMission9 - Deployment Deck: Command Battle Edition
 *
 * Props:
 *  - onComplete({ xp }) - called when mission finishes successfully
 *
 * Requirements:
 *  - TailwindCSS classes available
 *  - Sound files placed at public/assets/sounds/<name>.mp3
 *  - Jenkins badge image at /assets/images/jenkins-core.png
 */

export default function JenkinsMission9({ onComplete = () => {} }) {
  // Game constants
  const timeRef = useRef(0);
const prevTimeRef = useRef(0);
const winRef = useRef(0);

  const WIN_STABILITY = 90;
  const WIN_DURATION = 60; // seconds required at/above WIN_STABILITY
  const GAME_TIME = 120; // Upper bound game timer (seconds) - safety
  const XP_REWARD = 200;

  // Refs
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const audioRef = useRef({});
  const lastTick = useRef(performance.now());

  // Game state
  const [running, setRunning] = useState(false);
  const [stability, setStability] = useState(100);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [winTimer, setWinTimer] = useState(0);
  const [status, setStatus] = useState("ready"); // ready, playing, won, lost
  const [log, setLog] = useState([]);
  const [connections, setConnections] = useState({
    buildToStaging: false,
    stagingToProd: false,
  });

  // active interactive object: player drags the "artifact" orb
  const dragState = useRef({
    dragging: false,
    from: null, // 'build' | 'staging'
    x: 0,
    y: 0,
  });

  // Errors (red sparks) array
  const errorsRef = useRef([]); // { id, x, y, life, severity } life seconds until auto-expire
  const idCounter = useRef(1);

  // Node positions (these are in canvas coords and adapt to size)
  const nodesRef = useRef({
    build: { x: 0, y: 0, r: 42 },
    staging: { x: 0, y: 0, r: 42 },
    production: { x: 0, y: 0, r: 42 },
    center: { x: 0, y: 0, r: 70 },
  });

  // Sound helper
  const sound = (name, volume = 1.0) => {
    try {
      const path = `/assets/sounds/${name}`;
      if (!audioRef.current[name]) {
        audioRef.current[name] = new Audio(path);
      }
      const a = audioRef.current[name].cloneNode();
      a.volume = volume;
      a.play().catch(() => {});
      return a;
    } catch {
      return null;
    }
  };

  // Logging utility
  const pushLog = (t) => {
    setLog((s) => {
      const arr = [t, ...s].slice(0, 6);
      return arr;
    });
  };

  // Initialize audio startup
  useEffect(() => {
    sound("startup.mp3", 0.5);
  }, []);

  // Resize & layout
  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = Math.max(480, parent.clientHeight * 0.5);
      layoutNodes(canvas);
      drawFrame(); // draw initial
    };
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Layout nodes based on canvas size
  function layoutNodes(canvas) {
  const w = canvas.width;
  const h = canvas.height;
  const cx = Math.floor(w * 0.7);
  const cy = Math.floor(h * 0.35);
  nodesRef.current.center = { x: cx, y: cy, r: 84 };

  // shift entire layout slightly right to avoid Legend overlap
  const leftBaseX = Math.floor(w * 0.28);
  const rowY = Math.floor(h * 0.35);
  const gap = Math.floor(w * 0.14);

  nodesRef.current.build = { x: leftBaseX, y: rowY, r: 36 };
  nodesRef.current.staging = { x: leftBaseX + gap, y: rowY, r: 36 };
  nodesRef.current.production = { x: leftBaseX + gap * 2, y: rowY, r: 36 };
}

  // Start the mission
  const startGame = () => {
    if (running) return;
    setRunning(true);
    setStatus("playing");
    setStability(100);
    setTimeLeft(GAME_TIME);
    setWinTimer(0);
    setConnections({ buildToStaging: false, stagingToProd: false });
    errorsRef.current = [];
    pushLog("Mission started — keep stability high!");
    sound("select.mp3", 0.6);
    // spawn a first set of errors
    spawnErrorNear("build");
    spawnErrorNear("staging");
    lastTick.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
  };

  // Spawn an error near a given node
  function spawnErrorNear(nodeName) {
    const nodes = nodesRef.current;
    const n = nodes[nodeName];
    if (!n) return;
    const id = idCounter.current++;
    const angle = Math.random() * Math.PI * 2;
    const dist = n.r + 18 + Math.random() * 24;
    const x = n.x + Math.cos(angle) * dist;
    const y = n.y + Math.sin(angle) * dist + (Math.random() - 0.5) * 8;
    const severity = 5 + Math.random() * 15; // percent impact on miss or over time
    const life = 10 + Math.random() * 8;
    errorsRef.current.push({ id, x, y, life, severity, node: nodeName, created: performance.now() });
    pushLog(`⚠️ Error spawned near ${nodeName}`);
    sound("alarm_beep.mp3", 0.5);
  }

  // Player fixes an error by clicking it
  function fixError(id) {
    const idx = errorsRef.current.findIndex((e) => e.id === id);
    if (idx >= 0) {
      const e = errorsRef.current.splice(idx, 1)[0];
      setStability((s) => Math.min(100, Math.round((s + (5 + e.severity / 3)) * 10) / 10));
      pushLog("✔️ Error fixed");
      sound("fix_success.mp3", 0.8);
    } else {
      sound("wrong_buzz.mp3", 0.8);
    }
  }

  // Core loop
  function loop(now) {
  const dt = Math.min(0.12, (now - lastTick.current) / 1000);
  lastTick.current = now;

  // Time management (fix for real-time clock)
  if (running) {
    timeRef.current = (timeRef.current || 0) + dt;
    if (Math.floor(timeRef.current) !== Math.floor(prevTimeRef.current || 0)) {
      setTimeLeft((t) => Math.max(0, GAME_TIME - Math.floor(timeRef.current)));
    }
    prevTimeRef.current = timeRef.current;
  }

  // Stability logic
  const errorCount = errorsRef.current.length;
  if (errorCount > 0) {
    let reduction = 0.2 * errorCount * dt;
    reduction += Math.random() * 0.05 * dt;
    setStability((s) => Math.max(0, +(s - reduction).toFixed(2)));
  } else if (connections.buildToStaging && connections.stagingToProd) {
    setStability((s) => Math.min(100, +(s + 0.15 * dt * 60).toFixed(2)));
  }

  // Error lifetimes
  const nowMs = performance.now();
  for (let i = errorsRef.current.length - 1; i >= 0; i--) {
    const e = errorsRef.current[i];
    e.life -= dt;
    if (e.life <= 0) {
      const penalty = 6 + e.severity / 3;
      setStability((s) => Math.max(0, +(s - penalty).toFixed(2)));
      pushLog("⏳ Error timed out — penalty!");
      sound("wrong_buzz.mp3", 0.7);
      errorsRef.current.splice(i, 1);
    }
  }

  // Random error spawn
  if (Math.random() < 0.012 + Math.max(0, 0.02 * (1 - stability / 100))) {
    const pick = ["build", "staging", "production"][Math.floor(Math.random() * 3)];
    spawnErrorNear(pick);
  }

  // Win/loss check
  if (stability >= WIN_STABILITY) {
    winRef.current = (winRef.current || 0) + dt;
    setWinTimer(winRef.current);
    if (winRef.current >= WIN_DURATION && status === "playing") {
      onWin();
      return; // stop loop on win
    }
  } else {
    winRef.current = 0;
  }

  if (stability <= 0 && status === "playing") {
    onLose();
    return;
  }

  drawFrame();
  if (status === "playing") rafRef.current = requestAnimationFrame(loop);
}


  // Win
  function onWin() {
  setStatus("won");
  setRunning(false);
  pushLog("✅ Stability maintained — Mission Success!");
  sound("success_big.mp3", 0.9);

  // XP and redirect (fixed)
  const XP_REWARD = 200;
  localStorage.setItem(
    "player_xp",
    parseInt(localStorage.getItem("player_xp") || 0) + XP_REWARD
  );

  setTimeout(() => {
    if (typeof onComplete === "function") {
      onComplete({ xp: XP_REWARD });
    } else {
      window.location.href = "/learn/jenkins/10"; // fallback route
    }
  }, 2000);
}


  // Lose
  function onLose() {
    setStatus("lost");
    setRunning(false);
    pushLog("💥 Stability collapsed — Mission Failure.");
    sound("fail.mp3", 0.9);
  }

  // Drawing function
  function drawFrame() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // background vignette
    const g = ctx.createRadialGradient(w * 0.6, h * 0.20, 10, w * 0.6, h * 0.5, Math.max(w, h));
    g.addColorStop(0, "rgba(0,50,30,0.14)");
    g.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // neon center ring (Jenkins core)
    const core = nodesRef.current.center;
    drawNeonRing(ctx, core.x, core.y, core.r, "#00ffd6", "#003324");

    // badge image inside center (draw clipped)
    const badge = new Image();
    badge.src = "/assets/images/jenkins-core.png";
    const bSize = core.r * 1.0;
    // draw in center with circular clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(core.x, core.y, bSize * 0.55, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.globalAlpha = 0.98;
    ctx.drawImage(badge, core.x - bSize * 0.55, core.y - bSize * 0.55, bSize * 1.1, bSize * 1.1);
    ctx.restore();

    // nodes
    const nodes = nodesRef.current;
    ["build", "staging", "production"].forEach((name, idx) => {
      const n = nodes[name];
      const color =
        name === "build" ? "#ffd966" : name === "staging" ? "#ff9f1c" : "#28e07a";
      drawNode(ctx, n.x, n.y, n.r, color, name);
    });

    // draw existing connections as beams
    if (connections.buildToStaging) {
      drawBeam(ctx, nodes.build, nodes.staging, "#66ffcc");
    }
    if (connections.stagingToProd) {
      drawBeam(ctx, nodes.staging, nodes.production, "#66ffcc");
    }

    // draw active drag line when dragging
    const ds = dragState.current;
    if (ds.dragging) {
      ctx.beginPath();
      ctx.moveTo(ds.from.x, ds.from.y);
      ctx.lineTo(ds.x, ds.y);
      ctx.strokeStyle = "rgba(102,255,204,0.9)";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.shadowColor = "#00ffcc";
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // draw errors (red sparks)
    for (const e of errorsRef.current) {
      drawError(ctx, e.x, e.y, e.severity);
    }
  }

  // node drawing helpers
  function drawNeonRing(ctx, x, y, r, neonColor = "#00ff99", inner = "#001a10") {
    // glow
    ctx.beginPath();
    ctx.arc(x, y, r + 12, 0, Math.PI * 2);
    ctx.fillStyle = `${hexToRGBA(neonColor, 0.06)}`;
    ctx.fill();

    // outer ring
    ctx.beginPath();
    ctx.arc(x, y, r + 6, 0, Math.PI * 2);
    ctx.strokeStyle = neonColor;
    ctx.lineWidth = 6;
    ctx.shadowColor = neonColor;
    ctx.shadowBlur = 28;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // inner
    ctx.beginPath();
    ctx.arc(x, y, r - 4, 0, Math.PI * 2);
    ctx.fillStyle = inner;
    ctx.fill();
  }

  function drawNode(ctx, x, y, r, color, label) {
    // outer glow
    ctx.beginPath();
    ctx.arc(x, y, r + 8, 0, Math.PI * 2);
    ctx.fillStyle = hexToRGBA(color, 0.06);
    ctx.fill();

    // ring
    ctx.beginPath();
    ctx.arc(x, y, r + 2, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // core
    ctx.beginPath();
    ctx.arc(x, y, r - 4, 0, Math.PI * 2);
    ctx.fillStyle = "#081111";
    ctx.fill();

    // label
    ctx.fillStyle = hexToRGBA(color, 0.95);
    ctx.font = "600 14px Inter, monospace";
    ctx.textAlign = "center";
    ctx.fillText(capitalize(label), x, y + r + 18);
  }

  function drawBeam(ctx, a, b, color = "#66ffcc") {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    // curve
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2 - 20;
    ctx.quadraticCurveTo(mx, my, b.x, b.y);
    ctx.lineWidth = 8;
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 22;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function drawError(ctx, x, y, severity = 8) {
    // small pulsing spark
    const t = performance.now() / 320;
    const pulse = 1 + Math.sin(t * 6) * 0.18;
    ctx.beginPath();
    ctx.arc(x, y, 8 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,70,60,0.98)";
    ctx.shadowColor = "rgba(255,70,60,0.9)";
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,150,120,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Utilities
  function hexToRGBA(hex, a = 1) {
    const h = hex.replace("#", "");
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${a})`;
  }
  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // Canvas pointer events for drag and click
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = () => canvas.getBoundingClientRect();

    function clientToCanvas(e) {
      const r = rect();
      const x = (e.clientX - r.left) * (canvas.width / r.width);
      const y = (e.clientY - r.top) * (canvas.height / r.height);
      return { x, y };
    }

    function hitNodeAtPoint(pt) {
      const nodes = nodesRef.current;
      for (const k of ["build", "staging", "production"]) {
        const n = nodes[k];
        const dx = pt.x - n.x;
        const dy = pt.y - n.y;
        if (dx * dx + dy * dy <= (n.r + 6) * (n.r + 6)) return k;
      }
      return null;
    }

    function hitErrorAtPoint(pt) {
      for (const e of errorsRef.current) {
        const dx = pt.x - e.x;
        const dy = pt.y - e.y;
        if (dx * dx + dy * dy <= 14 * 14) return e.id;
      }
      return null;
    }

    function onPointerDown(e) {
      if (!running) return;
      const pt = clientToCanvas(e);
      // clicking an error fixes it instantly
      const err = hitErrorAtPoint(pt);
      if (err) {
        fixError(err);
        e.preventDefault();
        return;
      }
      // start drag from a node if clicked on build or staging
      const hit = hitNodeAtPoint(pt);
      if (hit === "build" || hit === "staging") {
        dragState.current.dragging = true;
        dragState.current.from = { name: hit, x: nodesRef.current[hit].x, y: nodesRef.current[hit].y };
        dragState.current.x = pt.x;
        dragState.current.y = pt.y;
        sound("typing.mp3", 0.15);
      }
    }

    function onPointerMove(e) {
      if (!running) return;
      if (!dragState.current.dragging) return;
      const pt = clientToCanvas(e);
      dragState.current.x = pt.x;
      dragState.current.y = pt.y;
      // draw immediate line for visual feedback
      drawFrame();
    }

    function onPointerUp(e) {
      if (!running) return;
      if (!dragState.current.dragging) return;
      const pt = clientToCanvas(e);
      const target = hitNodeAtPoint(pt); // where released
      const fromName = dragState.current.from.name;
      // logic: build -> staging connection; staging -> production connection
      if (fromName === "build" && target === "staging") {
        if (!connections.buildToStaging) {
          setConnections((c) => ({ ...c, buildToStaging: true }));
          pushLog("→ Build → Staging connection established.");
          sound("select.mp3", 0.6);
        } else {
          sound("wrong_buzz.mp3", 0.6);
        }
      } else if (fromName === "staging" && target === "production") {
        if (!connections.stagingToProd) {
          setConnections((c) => ({ ...c, stagingToProd: true }));
          pushLog("→ Staging → Production connection established.");
          sound("select.mp3", 0.6);
        } else {
          sound("wrong_buzz.mp3", 0.6);
        }
      } else {
        // incorrect drop - small penalty (and feedback)
        setStability((s) => Math.max(0, +(s - 1.8).toFixed(2)));
        pushLog("✖ Incorrect routing — stability dropped.");
        sound("wrong_buzz.mp3", 0.6);
      }

      // small effect: successful deploy pulse if both connections active
      if (connections.buildToStaging && connections.stagingToProd) {
        // simulate a deploy cycle (small chance of test fail)
        const failChance = 0.12;
        if (Math.random() < failChance) {
          // create a bigger error near production
          spawnErrorNear("production");
          setStability((s) => Math.max(0, +(s - 8).toFixed(2)));
          pushLog("🚨 Deploy reported a test failure!");
          sound("alarm_beep.mp3", 0.7);
        } else {
          pushLog("✅ Deploy cycle succeeded.");
          sound("success_big.mp3", 0.8);
          setStability((s) => Math.min(100, +(s + 2.4).toFixed(2)));
        }
      }

      // reset dragging
      dragState.current.dragging = false;
      dragState.current.from = null;
      dragState.current.x = 0;
      dragState.current.y = 0;
    }

    // Attach
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, connections, stability]);

  // Draw periodic (keeps canvas in sync when react state updates)
  useEffect(() => {
    drawFrame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stability, connections, status]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Render UI
  return (
    <div className="w-full h-screen bg-black text-green-200 font-mono flex flex-col items-center justify-start overflow-hidden relative">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-8 pt-6 z-20">
        <div className="flex items-center gap-4">
          <div className="text-lg text-green-300 font-semibold">[MISSION_9] The Deployment Deck</div>
          <div className="text-sm text-green-400/80">Futuristic Battle Style</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-2 rounded-lg bg-black/60 border border-green-700 shadow-[0_0_20px_#00ff88]">
            <div className="text-xs text-green-300">Stability</div>
            <div className="w-40 h-4 bg-gray-900 rounded-full mt-1 overflow-hidden">
              <div style={{ width: `${Math.max(0, Math.min(100, stability))}%` }} className={`h-full bg-gradient-to-r from-emerald-400 to-cyan-400`} />
            </div>
          </div>

          <div className="px-3 py-2 rounded-lg bg-black/60 border border-green-700">
            <div className="text-xs text-green-300">Win Timer</div>
            <div className="text-sm text-green-100">{Math.floor(winTimer)}s / {WIN_DURATION}s</div>
          </div>

          <div className="px-3 py-2 rounded-lg bg-black/60 border border-green-700">
            <div className="text-xs text-green-300">Time Running</div>
            <div className="text-sm text-green-100">{Math.floor(GAME_TIME - timeLeft)}s</div>
          </div>

          <button
            onClick={() => {
              if (status === "playing") {
                // quick pause - not implemented deeply; just stop loop
                setStatus("ready");
                setRunning(false);
                pushLog("⏸ Mission paused");
              } else {
                startGame();
              }
            }}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-semibold shadow-lg"
          >
            {status === "playing" ? "Pause" : "Start Mission"}
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="w-full flex-1 flex items-center justify-center mt-4 relative">
        <div className="w-[92%] max-w-[1300px] bg-black/0 rounded-xl p-4 relative">
          <canvas ref={canvasRef} className="w-full h-96 rounded-xl"></canvas>

          {/* overlays: logs and quick legend */}
          <div className="absolute right-6 top-14 w-64 bg-black/60 border border-green-800 p-3 rounded-lg shadow-[0_0_40px_#00ff88]">
            <div className="text-xs text-green-300 mb-2">Mission Logs</div>
            <div className="text-sm text-green-200 space-y-1">
              {log.length === 0 ? <div className="text-green-400/70">No events yet</div> : log.map((l, idx) => <div key={idx}>{l}</div>)}
            </div>
          </div>

          <div className="absolute left-6 top-14 w-40 bg-black/60 border border-green-800 p-3 rounded-lg">
            <div className="text-xs text-green-300 mb-2">Legend</div>
            <div className="text-sm text-green-200 space-y-2">
              <div>○ Build → Drag orb from Build</div>
              <div>○ Fix red sparks (click)</div>
              <div>○ Create connections: Build → Staging → Prod</div>
            </div>
          </div>
        </div>
      </div>

      {/* bottom area: status / results */}
      <div className="w-full flex items-center justify-center py-6 gap-8">
        {status === "ready" && (
          <div className="text-green-300">Press <strong>Start Mission</strong> to begin.</div>
        )}
        {status === "playing" && (
          <div className="text-green-200">Stability: {Math.round(stability)}% — Fix errors fast!</div>
        )}
        {status === "won" && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-3xl text-emerald-300 font-bold">
            🎉 Mission Success! +{XP_REWARD} XP
          </motion.div>
        )}
        {status === "lost" && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-3xl text-red-400 font-bold">
            ❌ Mission Failed — try again
          </motion.div>
        )}
      </div>
    </div>
  );
}
