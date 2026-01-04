// components/missions/JenkinsMission10.jsx
import { useState, useEffect, useRef } from "react";

export default function JenkinsMission10({ onComplete = () => {} }) {
  const pairs = [
    { user: "Alice", role: "Admin" },
    { user: "Bob", role: "Developer" },
    { user: "Eve", role: "Viewer" },
  ];
  const [assignments, setAssignments] = useState({});
  const [msg, setMsg] = useState("");
  const success = useRef(null);
  const XP = 200;

  useEffect(()=>{ success.current = new Audio("/assets/sounds/success.mp3"); }, []);

  const assign = (user, role) => setAssignments(p => ({ ...p, [user]: role }));

  const submit = () => {
    let ok = true;
    pairs.forEach(p => { if (assignments[p.user] !== p.role) ok = false; });
    if (ok) {
      success.current?.play().catch(()=>{});
      setMsg("Access rules applied ✅");
      localStorage.setItem("mission-jenkins-10","completed");
      const prev = parseInt(localStorage.getItem("xp")||"0",10);
      localStorage.setItem("xp", String(prev+XP));
      setTimeout(()=>onComplete({ xp: XP }), 900);
    } else setMsg("Some assignments are incorrect.");
  };

  return (
    <div className="p-6 bg-black text-green-300">
      <h2 className="text-2xl mb-4">Mission 10 — Access Guardian</h2>

      <div className="grid gap-3 max-w-xl">
        {pairs.map(p => (
          <div key={p.user} className="p-3 bg-gray-900 rounded border border-green-700 flex items-center justify-between">
            <div>{p.user}</div>
            <div className="flex gap-2">
              {["Admin","Developer","Viewer"].map(r => (
                <button key={r} onClick={() => assign(p.user, r)} className={`px-2 py-1 rounded ${assignments[p.user]===r ? "bg-green-600" : "bg-gray-700"}`}>{r}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4"><button onClick={submit} className="px-4 py-2 bg-green-600 rounded">Apply</button></div>
      <div className="mt-2 text-sm">{msg}</div>
    </div>
  );
}
