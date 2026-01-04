// components/missions/JenkinsMission8.jsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/*
Props:
  - onComplete: function({ xp }) called when mission completed
  - xpReward: number (optional) default 250
Notes:
  - Audio files referenced should exist at /assets/sounds/
  - Images: /assets/images/jenkins-core.png (badge)
*/

export default function JenkinsMission8({ onComplete = () => {}, xpReward = 250 }) {
  // --- Game config ----------------------------------------------------------
  const rounds = [
    {
      id: "r1",
      title: "Nightly build — Unit tests",
      logs: [
        "[INFO] Starting build...",
        "[INFO] Running tests...",
        "[PASS] AuthTests",
        "[FAIL] PaymentProcessorTests - AssertionError: expected <true> but was <false>",
        "[INFO] Collecting reports...",
      ],
      // which log index is the real error user must fix
      errorIndex: 3,
      correctFix: "patch_assertion",
      timeLimit: 18, // seconds
    },
    {
      id: "r2",
      title: "Integration: External API",
      logs: [
        "[INFO] Starting build...",
        "[INFO] Running integration tests...",
        "[FAIL] PaymentGatewayIT - TimeoutException: connection timed out",
        "[INFO] Archiving artifacts...",
      ],
      errorIndex: 2,
      correctFix: "mock_api",
      timeLimit: 16,
    },
    {
      id: "r3",
      title: "Flaky tests storm",
      logs: [
        "[INFO] Starting build...",
        "[INFO] Running tests in parallel...",
        "[FAIL] OrderServiceTests - NullPointerException at OrderProcessor.java:113",
        "[FAIL] UserProfileTests - AssertionError: expected <OK> but was <ERROR>",
        "[INFO] Uploading results...",
      ],
      // For last round require two fixes simultaneously (both indices)
      errorIndex: [2, 3],
      correctFix: ["patch_null", "patch_assertion"], // order matches indices
      timeLimit: 24,
    },
  ];

  const fixes = [
    { id: "patch_assertion", label: "Patch Assertion" },
    { id: "mock_api", label: "Mock External API" },
    { id: "retry_tests", label: "Retry Test" },
    { id: "patch_null", label: "Null-check Patch" },
  ];

  // --- State ---------------------------------------------------------------
  const [phase, setPhase] = useState("intro"); // intro | playing | success | failure
  const [roundIndex, setRoundIndex] = useState(0);
  const [typedLogs, setTypedLogs] = useState([]); // array of strings typed so far
  const [activeLine, setActiveLine] = useState(null); // index of line clicked / active error
  const [selectedFix, setSelectedFix] = useState(null); // fix id (tap) or drag
  const [fixedIndices, setFixedIndices] = useState([]); // for round 3 multi-fix
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false); // pulse badge
  const timerRef = useRef(null);
  const typingRef = useRef(null);
  const audioRef = useRef(null);
  const [showBadgePulse, setShowBadgePulse] = useState(false);
  const [xpPopup, setXpPopup] = useState(false);

  // convenience refs
  const current = rounds[roundIndex];

  // --- Audio helpers -------------------------------------------------------
  const playSound = (path, volume = 0.9) => {
    try {
      const a = new Audio(path);
      a.volume = volume;
      a.play().catch(() => {});
      audioRef.current = a;
      return a;
    } catch {
      return null;
    }
  };

  // --- Start / round flow --------------------------------------------------
  useEffect(() => {
    if (phase !== "playing") return;
    startRound();
    // cleanup when leaving playing
    return () => {
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, roundIndex]);

  const startRound = () => {
    setTypedLogs([]);
    setActiveLine(null);
    setSelectedFix(null);
    setFixedIndices([]);
    setShowBadgePulse(true);
    setIsSpeaking(true);

    // start typing logs sequentially
    typeLogs(current.logs, () => {
      // after typing finished, highlight error line(s)
      setIsSpeaking(false);
      setActiveLine(null);
      // start the countdown timer
      setTimeLeft(current.timeLimit);
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            onTimeUp();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      // small alert for user
      playSound("/assets/sounds/alarm_beep.mp3", 0.6);
    });
  };

  const clearTimers = () => {
    if (typingRef.current) {
      clearTimeout(typingRef.current);
      typingRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = "";
      } catch {}
      audioRef.current = null;
    }
  };

  const onTimeUp = () => {
    setShowBadgePulse(false);
    setPhase("failure");
    playSound("/assets/sounds/fail.mp3", 0.7);
  };

  // --- Typing effect (per line) -------------------------------------------
  const typeLogs = async (lines, onComplete) => {
    const out = [];
    let i = 0;

    const typeLine = () => {
      const line = lines[i];
      let charIndex = 0;
      out[i] = "";
      const step = () => {
        // append next char
        out[i] += line[charIndex] || "";
        setTypedLogs([...out]);
        charIndex++;
        // small typing sound
        if (charIndex % 6 === 0) playSound("/assets/sounds/typing.mp3", 0.05);
        if (charIndex <= line.length) {
          typingRef.current = setTimeout(step, 24 + Math.random() * 18);
        } else {
          // line done
          i++;
          if (i < lines.length) {
            // small pause between lines
            typingRef.current = setTimeout(typeLine, 300);
          } else {
            // all done
            typingRef.current = null;
            if (onComplete) onComplete();
          }
        }
      };
      step();
    };

    typeLine();
  };

  // --- Interactions: click error line (select) & apply fix -----------------
  // click line -> if it's an error line index, select it
  const handleClickLine = (index) => {
    // allow selection only after typing finished (timer started) OR when lines typed fully
    if (!current) return;
    const errIdx = current.errorIndex;
    const accepts =
      Array.isArray(errIdx) ? errIdx.includes(index) : index === errIdx;
    if (!accepts) return;
    setActiveLine((prev) => (prev === index ? null : index));
    playSound("/assets/sounds/select.mp3", 0.3);
  };

  // user picks a fix (tap) or receives drop from drag
  const applyFix = (fixId, targetIdx = null) => {
    if (!current) return;

    // Determine expected indices and expected fixes
    const expectedIndices = Array.isArray(current.errorIndex)
      ? current.errorIndex
      : [current.errorIndex];
    const expectedFixes = Array.isArray(current.correctFix)
      ? current.correctFix
      : [current.correctFix];

    // If target not set -> use activeLine or first error index
    let target = targetIdx;
    if (target == null && activeLine != null) target = activeLine;
    if (target == null) target = expectedIndices[0];

    // check if this target is expected and fix matches
    const idxPos = expectedIndices.indexOf(target);
    if (idxPos === -1) {
      // wrong target
      // tiny negative feedback
      playSound("/assets/sounds/wrong_buzz.mp3", 0.6);
      // flash or shake? (we keep simple)
      return;
    }

    // If fix matches expected for this index
    const expectedForThis = expectedFixes[idxPos];
    if (expectedForThis === fixId) {
      // mark fixed
      setFixedIndices((prev) => {
        if (prev.includes(target)) return prev;
        const next = [...prev, target];
        // success sound
        playSound("/assets/sounds/fix_success.mp3", 0.7);
        // if all fixed, progress round
        if (next.length >= expectedIndices.length) {
          // clear timer
          clearInterval(timerRef.current);
          timerRef.current = null;
          // minor success animation/pulse
          setShowBadgePulse(false);
          setTimeout(() => {
            // advance to next round or finish
            if (roundIndex < rounds.length - 1) {
              setRoundIndex((r) => r + 1);
            } else {
              // mission success
              setPhase("success");
              setXpPopup(true);
              playSound("/assets/sounds/success_big.mp3", 0.8);
              // call onComplete after small delay
              setTimeout(() => {
                setXpPopup(false);
                onComplete({ xp: xpReward });
              }, 1400);
            }
          }, 800);
        }
        return next;
      });
    } else {
      // wrong fix
      playSound("/assets/sounds/wrong_buzz.mp3", 0.7);
    }
  };

  // --- Drag & drop support (desktop) --------------------------------------
  const onDragStart = (e, fixId) => {
    e.dataTransfer.setData("text/plain", fixId);
    // tiny haptic-like sound
    playSound("/assets/sounds/select.mp3", 0.2);
  };

  const onDropLine = (e, idx) => {
    e.preventDefault();
    const fixId = e.dataTransfer.getData("text/plain");
    if (fixId) applyFix(fixId, idx);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  // --- Intro / controls ----------------------------------------------------
  const startGame = () => {
    setPhase("playing");
    playSound("/assets/sounds/startup.mp3", 0.7);
  };

  const resetGame = () => {
    clearTimers();
    setPhase("intro");
    setRoundIndex(0);
    setTypedLogs([]);
    setActiveLine(null);
    setFixedIndices([]);
    setSelectedFix(null);
    setTimeLeft(0);
    setShowBadgePulse(false);
    setXpPopup(false);
  };

  // --- Render helpers ------------------------------------------------------
  const isErrorLine = (index) => {
    if (!current) return false;
    const idx = current.errorIndex;
    return Array.isArray(idx) ? idx.includes(index) : idx === index;
  };

  // small helper for showing badges and pulses
  const badgeSize = 180;

  // --- Cleanup on unmount -------------------------------------------------
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  // --- UI ------------------------------------------------------------------
  return (
    <div className="w-screen h-screen bg-black text-green-300 font-mono flex flex-col items-center justify-start overflow-hidden relative">
      {/* Top - badge */}
      <div className="w-full flex items-center justify-center mt-6">
        <motion.div
          className="relative flex items-center justify-center rounded-full border-[6px] border-green-500 bg-black/80"
          style={{
            width: badgeSize,
            height: badgeSize,
            boxShadow: showBadgePulse
              ? "0 0 70px 20px rgba(0,255,136,0.08)"
              : "0 0 30px rgba(0,255,136,0.06)",
          }}
          animate={showBadgePulse ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={{ duration: 1.1, repeat: showBadgePulse ? Infinity : 0 }}
        >
          <img
            src="/assets/images/jenkins-core.png"
            alt="Jenkins Core"
            className="w-[140px] h-[140px] rounded-full object-cover pointer-events-none"
          />
          <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl pointer-events-none" />
        </motion.div>
      </div>

      {/* Center area */}
      <div className="w-full max-w-5xl mt-8 px-6 flex flex-col items-center gap-6">
        {/* Intro or round panel */}
        {phase === "intro" && (
          <motion.div
            className="w-full bg-black/80 border border-green-700 rounded-2xl p-8 shadow-[0_0_50px_#00ff88] text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl text-green-400 mb-3">[MISSION_8] The Debugging Arena</h2>
            <p className="text-green-300 mb-6">
              Fix failing builds by reading live logs, selecting the error line,
              and applying the correct repair module.
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-full bg-green-600 text-black font-bold shadow-[0_0_24px_#00ff88]"
            >
              Enter Debugging Arena
            </button>
          </motion.div>
        )}

        {phase === "playing" && current && (
          <div className="w-full flex flex-col md:flex-row gap-6 items-start">
            {/* Left: log terminal */}
            <div className="flex-1 bg-black/85 border border-green-700 rounded-2xl p-6 shadow-[0_0_36px_#00ff88] relative">
              <div className="text-sm text-green-300 mb-2">
                <strong>{current.title}</strong> — time left:{" "}
                <span className="font-semibold text-yellow-300">{timeLeft}s</span>
              </div>

              <div
                className="h-72 overflow-auto bg-black/60 rounded-md p-4 font-mono text-green-300 text-sm leading-relaxed"
                aria-live="polite"
              >
                {/* Render typed lines */}
                {current.logs.map((line, idx) => {
                  const typed = typedLogs[idx] || "";
                  const clickable = isErrorLine(idx) && typed.length >= line.length;
                  const fixed = fixedIndices.includes(idx);
                  return (
                    <div
                      key={idx}
                      className={`py-1 cursor-pointer select-none ${
                        clickable ? "hover:brightness-125" : ""
                      }`}
                      onClick={() => handleClickLine(idx)}
                      onDrop={(e) => onDropLine(e, idx)}
                      onDragOver={allowDrop}
                      style={{
                        color: fixed ? "white" : clickable ? "#ff8b8b" : undefined,
                        textShadow: fixed ? "0 0 12px rgba(0,255,136,0.3)" : undefined,
                        opacity: clickable ? 1 : 0.95,
                        fontWeight: fixed ? 700 : 400,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          minHeight: 20,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {typed || <span className="text-green-700/70">…</span>}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* small helper / status */}
              <div className="mt-3 text-xs text-green-300/80">
                Click the failing log line (highlighted in red), then apply a fix module
                (drag or tap).
              </div>
            </div>

            {/* Right: fix tools */}
            <div className="w-80 flex-shrink-0 flex flex-col gap-4 items-center">
              <div className="w-full bg-black/85 border border-green-700 rounded-2xl p-4 shadow-[0_0_20px_#00ff88]">
                <div className="text-sm text-green-300 mb-3 font-semibold">Repair Console</div>

                <div className="grid grid-cols-1 gap-3">
                  {fixes.map((f) => (
                    <div
                      key={f.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, f.id)}
                      onClick={() => {
                        // Tap behavior: if activeLine selected -> apply fix
                        if (activeLine != null) {
                          applyFix(f.id);
                          setSelectedFix(null);
                        } else {
                          // select a fix (then click error line)
                          setSelectedFix((s) => (s === f.id ? null : f.id));
                          playSound("/assets/sounds/select.mp3", 0.2);
                        }
                      }}
                      className={`px-4 py-3 rounded-md text-sm text-green-900 font-semibold bg-gradient-to-br ${
                        selectedFix === f.id
                          ? "from-green-300 to-green-200 shadow-[0_0_20px_#00ff88]"
                          : "from-green-800/50 to-black/30 border border-green-600"
                      } cursor-pointer user-select-none`}
                      style={{ textAlign: "center" }}
                    >
                      {f.label}
                      <div className="text-xs text-green-100 font-medium mt-1">{f.id}</div>
                    </div>
                  ))}
                </div>

                {/* If user tapped a fix first, show helper */}
                <div className="mt-3 text-xs text-green-300/80">
                  {selectedFix
                    ? "Now tap the highlighted error line to apply the selected fix."
                    : "You can also drag a fix directly onto the error line."}
                </div>
              </div>

              {/* Round / progress */}
              <div className="w-full text-sm text-green-300/90 text-center">
                Round {roundIndex + 1} / {rounds.length}
              </div>

              <div className="w-full flex justify-center">
                <button
                  className="px-4 py-2 rounded-full bg-black/60 border border-green-600 text-green-200"
                  onClick={() => {
                    // developer: skip round
                    clearTimers();
                    if (roundIndex < rounds.length - 1) setRoundIndex((r) => r + 1);
                    else {
                      setPhase("success");
                      onComplete({ xp: xpReward });
                    }
                  }}
                >
                  Skip (dev)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success / Failure */}
        {phase === "success" && (
          <div className="w-full bg-black/80 border border-green-700 rounded-2xl p-8 shadow-[0_0_50px_#00ff88] text-center">
            <h2 className="text-3xl text-green-400 mb-3">BUILD SUCCESS ✅</h2>
            <p className="text-green-300 mb-6">You restored the pipeline and stabilized builds.</p>
            <div className="text-5xl font-bold text-green-300 mb-4">+{xpReward} XP</div>
            <button
              onClick={() => onComplete({ xp: xpReward })}
              className="px-6 py-3 rounded-full bg-green-600 text-black font-bold shadow-[0_0_24px_#00ff88]"
            >
              Continue
            </button>
          </div>
        )}

        {phase === "failure" && (
          <div className="w-full bg-black/80 border border-red-600 rounded-2xl p-8 shadow-[0_0_50px_#ff6b6b] text-center">
            <h2 className="text-3xl text-red-400 mb-3">BUILD FAILURE</h2>
            <p className="text-red-300 mb-6">The build timed out before repairs could complete.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={resetGame}
                className="px-6 py-3 rounded-full bg-red-600 text-black font-bold shadow-[0_0_12px_#ff6b6b]"
              >
                Retry Mission
              </button>
              <button
                onClick={() => onComplete({ xp: 0 })}
                className="px-6 py-3 rounded-full bg-black/60 border border-green-600 text-green-200"
              >
                Exit (no XP)
              </button>
            </div>
          </div>
        )}

        {/* xp popup */}
        {xpPopup && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed left-1/2 -translate-x-1/2 bottom-24 text-4xl font-bold text-green-400 drop-shadow-[0_0_25px_#00ff88]"
          >
            +{xpReward} XP Earned!
          </motion.div>
        )}
      </div>
    </div>
  );
}
