// components/missions/JenkinsMission11.jsx
import { useState, useRef, useEffect } from "react";

export default function JenkinsMission11({ onComplete = () => {} }) {
  const nodes = ["Jenkins","Docker","Kubernetes"];
  const [links, setLinks] = useState([]);
  const [msg, setMsg] = useState("");
  const XP = 210;
  const success = useRef(null);

  useEffect(()=>{ success.current = new Audio("/assets/sounds/success.mp3"); }, []);

  const toggleLink = (a,b) => {
    const key = `${a}-${b}`;
    if (links.includes(key)) setLinks(prev => prev.filter(x=>x!==key));
    else setLinks(prev => [...prev, key]);
  };

  const submit = () => {
    // required links: Jenkins-Docker, Jenkins-Kubernetes
    const required = ["Jenkins-Docker","Jenkins-Kubernetes"];
    const ok = required.every(r=>links.includes(r));
    if (ok) {
      success.current?.play().catch(()=>{});
      setMsg("Integration complete ✅");
      localStorage.setItem("mission-jenkins-11","completed");
      const prev = parseInt(localStorage.getItem("xp")||"0",10);
      localStorage.setItem("xp", String(prev+XP));
      setTimeout(()=>onComplete({ xp: XP }), 900);
    } else setMsg("Connect Jenkins to Docker and Kubernetes.");
  };

  return (
    <div className="p-6 bg-black text-green-300">
      <h2 className="text-2xl mb-4">Mission 11 — Integration Chamber</h2>
      <div className="flex gap-4 mb-4">
        {nodes.map(n => (
          <div key={n} className="p-3 bg-gray-900 rounded border border-green-700">{n}</div>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        <button onClick={()=>toggleLink("Jenkins","Docker")} className={`px-3 py-1 rounded ${links.includes("Jenkins-Docker") ? "bg-green-600":"bg-gray-700"}`}>Link Jenkins ↔ Docker</button>
        <button onClick={()=>toggleLink("Jenkins","Kubernetes")} className={`px-3 py-1 rounded ${links.includes("Jenkins-Kubernetes") ? "bg-green-600":"bg-gray-700"}`}>Link Jenkins ↔ K8s</button>
      </div>
      <div>
        <button onClick={submit} className="px-4 py-2 bg-green-600 rounded">Validate Integration</button>
      </div>
      <div className="mt-2 text-sm">{msg}</div>
    </div>
  );
}
