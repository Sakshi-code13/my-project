// pages/mission/[world]/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// small UI helpers
function XPBar({ xp, max = 1000 }) {
  const pct = Math.min((xp / max) * 100, 100);
  return (
    <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden border border-green-700">
      <div
        className="h-4 bg-green-400 transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// Lazy import mini-game components (simple in-file)
function TheoryView({ mission, onComplete }) {
  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-3">Theory: {mission.name}</h3>
      <div className="text-gray-200 mb-4">{mission.description}</div>
      <div className="text-sm text-gray-300 mb-4">
        Read the short theory, then press Complete to get XP.
      </div>
      <button
        onClick={() => onComplete()}
        className="px-4 py-2 bg-green-600 rounded-md"
      >
        Mark Theory Complete
      </button>
    </div>
  );
}

function QuizMini({ mission, onComplete }) {
  // small 2-question quiz example (extendable)
  const q = [
    {
      id: 1,
      text: "CI stands for?",
      options: ["Continuous Integration", "Code Integration", "Continuous Install"],
      answer: 0,
    },
    {
      id: 2,
      text: "Jenkins pipelines are defined in?",
      options: ["package.json", "Jenkinsfile", "dockerfile"],
      answer: 1,
    },
  ];
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const submit = () => {
    const correct = q.reduce((acc, cur) => acc + (answers[cur.id] === cur.answer ? 1 : 0), 0);
    setResult(correct);
    // require 100% for success in this example
    if (correct === q.length) onComplete();
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-3">Quiz: {mission.name}</h3>
      {q.map((item) => (
        <div key={item.id} className="mb-4">
          <div className="font-medium">{item.text}</div>
          <div className="flex gap-3 mt-2">
            {item.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setAnswers((s) => ({ ...s, [item.id]: i }))}
                className={`px-3 py-1 rounded-md ${
                  answers[item.id] === i ? "bg-green-500 text-black" : "bg-gray-800"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-3">
        <button onClick={submit} className="px-4 py-2 bg-green-600 rounded-md">Submit</button>
        {result !== null && <div className="text-gray-300">Score: {result}/{q.length}</div>}
      </div>
    </div>
  );
}

function DragPuzzle({ mission, onComplete }) {
  // Very simple drag-and-drop simulation using HTML5 DnD.
  // Items must be dropped into the right slots to "fix the pipeline".
  const [solved, setSolved] = useState(false);
  useEffect(() => { if (solved) onComplete(); }, [solved]);

  const canDrop = (e, slot) => {
    e.preventDefault();
  };
  const onDrop = (e, slot) => {
    const id = e.dataTransfer.getData("text/plain");
    if (id === slot) {
      // mark visually by setting element to slot
      const el = document.getElementById(id);
      el.style.display = "none";
      const slotEl = document.getElementById("slot-" + slot);
      slotEl.textContent = id;
      // very naive check: if slotFilled
      const filled = ["build", "test", "deploy"].every((s) => {
        const se = document.getElementById("slot-" + s);
        return se && se.textContent && se.textContent.length > 0;
      });
      if (filled) setSolved(true);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-3">Puzzle: {mission.name}</h3>
      <div className="mb-4 text-gray-300">Drag the correct pipeline steps into slots (build → test → deploy)</div>

      <div className="flex gap-8">
        <div className="w-1/3 p-4 bg-gray-900 rounded">
          {["build","deploy","test"].map((id) => (
            <div
              key={id}
              id={id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", id)}
              className="mb-3 px-3 py-2 bg-green-600 rounded cursor-grab"
            >
              {id}
            </div>
          ))}
        </div>

        <div className="w-2/3 p-4 bg-gray-800 rounded">
          <div className="mb-3">Pipeline slots:</div>
          {["build","test","deploy"].map((slot) => (
            <div
              key={slot}
              id={"slot-" + slot}
              onDragOver={(e) => canDrop(e, slot)}
              onDrop={(e) => onDrop(e, slot)}
              className="mb-2 h-12 border border-gray-600 rounded flex items-center px-3 bg-black/30"
            >
              <span className="text-gray-400">Drop step here ({slot})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CodeMini({ mission, onComplete }) {
  // Simple code-entry validation (user types a snippet and we check contains keyword)
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const check = () => {
    // simplistic check: user included 'pipeline' and 'stage'
    if (code.includes("pipeline") && code.includes("stage")) {
      onComplete();
    } else {
      setMsg("Missing 'pipeline' or 'stage' keywords. Try again!");
    }
  };
  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-3">Code: {mission.name}</h3>
      <div className="mb-3 text-gray-300">Write a small Jenkinsfile-like snippet (type keywords 'pipeline' and 'stage')</div>
      <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-40 bg-black/60 p-3 rounded text-white" />
      <div className="flex gap-3 mt-3">
        <button onClick={check} className="px-4 py-2 bg-green-600 rounded-md">Validate</button>
        {msg && <div className="text-yellow-300">{msg}</div>}
      </div>
    </div>
  );
}

export default function MissionPage() {
  const router = useRouter();
  const { world, id } = router.query;
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState("intro"); // intro | playing | completed
  const [xpTotal, setXpTotal] = useState(0);
  const [resuming, setResuming] = useState(false);

  // fetch mission metadata from our API
  useEffect(() => {
    if (!world || !id) return;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/missions/${world}/${id}`);
        const data = await res.json();
        if (data?.mission) {
          setMission(data.mission);
          // load local progress
          const lsKey = `progress_${world}_${id}`;
          const saved = localStorage.getItem(lsKey);
          if (saved) {
            setResuming(true);
          }
        } else {
          setMission(null);
        }
      } catch (e) {
        console.error(e);
        setMission(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [world, id]);

  // load player's xp from DB via progress endpoint
  useEffect(() => {
    if (!world) return;
    fetch(`/api/progress/${world}`)
      .then((r) => r.json())
      .then((d) => {
        setXpTotal(d.xp || 0);
      })
      .catch(() => {});
  }, [world]);

  const startMission = () => {
    setPhase("playing");
    // mark start in localStorage
    localStorage.setItem(`progress_${world}_${id}`, JSON.stringify({ startedAt: Date.now(), progress: {} }));
  };

  const completeMission = async () => {
    setPhase("completed");
    // award xp on DB and unlock next mission
    const award = mission?.xp || 0;

    // fetch existing profile
    let profile = { xp: 0, missions: [] };
    try {
      const r = await fetch(`/api/progress/${world}`);
      const d = await r.json();
      profile = d || profile;
    } catch (e) {}

    // update local profile
    profile.xp = (profile.xp || 0) + award;

    // mark mission completed in profile.missions
    profile.missions = profile.missions || [];
    const exists = profile.missions.find((m) => m.id === mission.id);
    if (!exists) profile.missions.push({ id: mission.id, completed: true });
    else exists.completed = true;

    // unlock next mission (handled in server or we do simple client-side hint)
    // save to server
    await fetch(`/api/progress/${world}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    // clear local mission progress
    localStorage.removeItem(`progress_${world}_${id}`);
    // show success then redirect back to world
    setTimeout(() => {
      router.push(`/world?character=${world}`);
    }, 1200);
  };

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-black text-green-400">Loading mission...</div>;
  if (!mission) return <div className="h-screen w-screen flex items-center justify-center bg-black text-red-400">Mission not found</div>;

  return (
    <div className="w-screen h-screen bg-black text-white p-8">
      {/* header with cinematic style */}
      <div className="max-w-3xl mx-auto bg-gradient-to-br from-black/60 to-black/30 border border-green-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-green-400">{mission.name}</h1>
            <div className="text-gray-300 mt-1">{mission.focusArea} — Level {mission.level}</div>
          </div>
          <div className="w-48">
            <XPBar xp={xpTotal} max={3000} />
            <div className="text-sm text-gray-300 mt-1">Total XP: {xpTotal}</div>
          </div>
        </div>

        {/* cinematic intro / mission description */}
        {phase === "intro" && (
          <div className="mb-6">
            <p className="text-gray-200">{mission.description}</p>
            <div className="mt-4 flex gap-4">
              <button onClick={startMission} className="px-4 py-2 bg-green-600 rounded-md">Start Mission</button>
              <button onClick={() => router.push(`/world?character=${world}`)} className="px-4 py-2 bg-gray-800 rounded-md">Back to World</button>
              {resuming && <div className="text-yellow-300 self-center">Resuming saved progress...</div>}
            </div>
          </div>
        )}

        {/* playing: choose the correct mini-game component based on mission.type */}
        {phase === "playing" && (
          <div className="bg-black/60 p-4 rounded">
            {mission.type?.toLowerCase().includes("theory") || mission.type?.toLowerCase().includes("setup") ? (
              <TheoryView mission={mission} onComplete={completeMission} />
            ) : mission.type?.toLowerCase().includes("quiz") || mission.type?.toLowerCase().includes("interactive") ? (
              <QuizMini mission={mission} onComplete={completeMission} />
            ) : mission.type?.toLowerCase().includes("puzzle") ? (
              <DragPuzzle mission={mission} onComplete={completeMission} />
            ) : mission.type?.toLowerCase().includes("code") || mission.type?.toLowerCase().includes("groovy") ? (
              <CodeMini mission={mission} onComplete={completeMission} />
            ) : (
              // fallback generic simulation
              <div className="p-6">
                <div className="mb-4">Simulation mission: {mission.name}</div>
                <div className="text-gray-300 mb-4">This mission runs a guided simulation inside the app.</div>
                <button onClick={() => completeMission()} className="px-4 py-2 bg-green-600 rounded-md">Complete Simulation</button>
              </div>
            )}
          </div>
        )}

        {/* completed state */}
        {phase === "completed" && (
          <div className="mt-4 p-4 bg-green-900/30 rounded-md text-green-300">
            🎉 Mission complete — awarding {mission.xp} XP... Redirecting to world...
          </div>
        )}
      </div>
    </div>
  );
}
