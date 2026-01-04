// pages/world.js
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import ExploreMap from "@/components/ui/ExploreMap";
import MissionMap from "../components/ui/MissionMap"; // Mission map
import MissionStartOverlay from "../components/ui/MissionStartOverlay"; // overlay
import Leaderboard from "@/components/ui/Leaderboard";



export default function WorldPage() {
  const router = useRouter();
  const [character, setCharacter] = useState(null);
  const [showExplore, setShowExplore] = useState(false);
  const [showMissions, setShowMissions] = useState(false); 
  const [xp, setXp] = useState(0);
  const [missions, setMissions] = useState([]);
  const audioRef = useRef(null);

  // Load character
  useEffect(() => {
    if (router.query.character) {
      setCharacter(router.query.character);
    }
  }, [router.query.character]);

  // Background music — plays continuously
  useEffect(() => {
  if (character) {
    const musicMap = {
      jenkins: "/assets/music/jenkins.mp3",
      docker: "/assets/music/docker.mp3",
      kubernetes: "/assets/music/kubernetes.mp3",
      git: "/assets/music/git.mp3",
    };

    // Stop any previous audio first
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Start fresh
    const music = new Audio(musicMap[character]);
    music.loop = true;
    music.volume = 0.25; // lower volume
    music.playbackRate = 0.9; // slightly slower for a calm effect
    music.play().catch(() => {});
    audioRef.current = music;

    // Cleanup on unmount
    return () => {
      music.pause();
      music.currentTime = 0;
    };
  }
}, [character]);


  // Fetch missions from MongoDB
  useEffect(() => {
    if (character === "jenkins") {
      fetch(`/api/missions/jenkins`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.missions) setMissions(data.missions);
          if (data?.xp) setXp(data.xp);
        })
        .catch((err) => console.error("Mission fetch failed:", err));
    }
  }, [character]);

  // Handle mission selection
  // onSelect handler in world.js
// Handle mission selection with cinematic intro
const [activeMission, setActiveMission] = useState(null);

const handleMissionSelect = (mission) => {
  const world = "jenkins";

  const learned = localStorage.getItem(`learn-${world}-${mission.id}`);
  const completedMission = localStorage.getItem(`mission-${world}-${mission.id}`);

  // Player can’t start a mission unless its learn is completed
  if (!learned && !completedMission) {
    alert(`🚫 You must complete Learn ${mission.id} before starting Mission ${mission.id}.`);
    return;
  }

  // Redirect to mission if unlocked
  router.push(`/mission/${world}/${mission.id}`);
};

  if (!character)
    return (
      <div className="h-screen w-screen bg-black text-green-400 flex items-center justify-center">
        Loading world...
      </div>
    );

  // Backgrounds
  const bgMap = {
    jenkins: "/assets/backgrounds/jenkins-bg.jpg",
    docker: "/assets/backgrounds/docker-bg.jpg",
    kubernetes: "/assets/backgrounds/kubernetes-bg.jpg",
    git: "/assets/backgrounds/git-bg.jpg",
  };

  const charVideoMap = {
    jenkins: "/assets/characters/jenkins-knight.mp4",
    docker: "/assets/characters/docker-mage.mp4",
    kubernetes: "/assets/characters/kubernetes-ninja.mp4",
    git: "/assets/characters/git-ranger.mp4",
  };

  const worldInfo = {
    jenkins: {
      name: "CI/CD Castle",
      description: "Train to master continuous integration and deployment pipelines.",
      challenge: "Automate your first build pipeline using Jenkins.",
      tip: "Remember: CI/CD is about speed + reliability.",
      theme: "from-purple-700/80 via-purple-900/70 to-black/90",
    },
    docker: {
      name: "Container Realm",
      description: "Learn the magic of containerization and deploy anywhere.",
      challenge: "Package and deploy your first container app.",
      tip: "Build once, run anywhere — the Docker way.",
      theme: "from-blue-800/80 via-blue-900/70 to-black/90",
    },
    kubernetes: {
      name: "Cloud Fortress",
      description: "Deploy and scale microservices across your Kubernetes kingdom.",
      challenge: "Orchestrate a multi-pod deployment.",
      tip: "Pods are your army — manage wisely.",
      theme: "from-cyan-700/80 via-sky-900/70 to-black/90",
    },
    git: {
      name: "Version Forest",
      description: "Master branching, merging, and collaboration with Git.",
      challenge: "Conquer merge conflicts and push your code cleanly.",
      tip: "Commit often, push wisely.",
      theme: "from-green-700/80 via-green-900/70 to-black/90",
    },
  };

  const world = worldInfo[character];

  return (
    <div
      className="relative w-screen h-screen text-white transition-all duration-700 overflow-hidden"
      style={{
        backgroundImage: `url(${bgMap[character]})`,
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#000",
      }}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${world.theme}`}
        style={{
          backdropFilter: "blur(0px)",
          backgroundColor: "rgba(0, 0, 0, 0)",
        }}
      ></div>

      {/* Hero portrait */}
      <div className="absolute top-4 left-4 rounded-full border-4 border-green-400 overflow-hidden w-20 h-20 shadow-xl animate-pulse">
        <video
          src={charVideoMap[character]}
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
        ></video>
      </div>

      {/* XP Display */}
      <div className="absolute top-4 right-6 bg-black/70 rounded-full px-6 py-2 border border-neon-500">
        <span className="text-green-400 font-bold">XP: {xp}</span>
      </div>

      {/* World info */}
      <div className="absolute top-8 left-32 max-w-[700px]">
        <h1 className="text-4xl font-extrabold text-green-400 drop-shadow-lg">
          {world.name}
        </h1>
        <p className="text-gray-200 text-lg mt-2 italic">{world.description}</p>
      </div>

      {/* Quest info box */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[80%] max-w-[700px] bg-black/50 border border-green-500 rounded-2xl p-6 shadow-lg text-center backdrop-blur-sm">
        <h2 className="text-2xl text-green-400 font-semibold mb-3">
          Quest: {world.challenge}
        </h2>
        <p className="text-gray-300 mb-4">{world.tip}</p>

        {/* Buttons */}
        <div className="flex justify-center gap-8 mt-4">
          <button
            onClick={() => setShowExplore(true)}
            className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-white"
          >
            Explore
          </button>
          <button
           onClick={() => setShowMissions(true)}
           className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white"
          >
          View Missions
          </button>

        </div>
      </div>

      {/* Explore Overlay */}
      {showExplore && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md border-t-4 border-green-400 animate-fadeIn overflow-y-auto">
          <div className="p-10">
            <h1 className="text-3xl font-extrabold text-green-400 mb-6">
              {world.name} — Explore Hub
            </h1>

            {/* XP progress */}
            <div className="w-full bg-green-900/40 rounded-full h-4 mb-8 border border-green-600">
              <div
                className="bg-green-400 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(xp / 10, 100)}%` }}
              ></div>
            </div>

            {/* Missions Map */}
           <section className="mb-10">
  <h2 className="text-2xl text-green-300 mb-3 font-semibold">🧭 Explore Map</h2>
  <div className="bg-black/40 rounded-xl p-4 border border-green-700">
    <ExploreMap
      learns={[
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
        { id: 11 },
        { id: 12 },
      ]}
    />
  </div>
</section>



            <section className="mb-10">
  <h2 className="text-2xl text-green-300 mb-3 font-semibold">🏆 Leaderboard</h2>
  <div className="bg-black/40 rounded-xl p-4 border border-green-700">
    <Leaderboard />
  </div>
</section>

            {/* Close button */}
            <button
              onClick={() => setShowExplore(false)}
              className="px-8 py-2 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Mission Overlay */}
{showMissions && (
  <div className="absolute inset-0 bg-black/90 backdrop-blur-md border-t-4 border-blue-400 animate-fadeIn overflow-y-auto">
    <div className="p-10">
      <h1 className="text-3xl font-extrabold text-blue-400 mb-6">
        {world.name} — Mission Command Center
      </h1>

      {/* XP progress */}
      <div className="w-full bg-blue-900/40 rounded-full h-4 mb-8 border border-blue-600">
        <div
          className="bg-blue-400 h-4 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(xp / 10, 100)}%` }}
        ></div>
      </div>

      {/* Mission Map Section */}
      <section className="mb-10">
        <h2 className="text-2xl text-blue-300 mb-3 font-semibold">🛰️ Mission Map</h2>
        <div className="bg-black/40 rounded-xl p-4 border border-blue-700">
          {missions.length > 0 ? (
            <MissionMap
              missions={missions}
              onStartMission={(mission) => {
                setActiveMission(mission);
                setShowMissions(false);
              }}
            />
          ) : (
            <p className="text-gray-400 italic">Loading mission data...</p>
          )}
        </div>
      </section>

      {/* Close button */}
      <button
        onClick={() => setShowMissions(false)}
        className="px-8 py-2 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-white"
      >
        Close
      </button>
    </div>
  </div>
)}

      {/* Mission Start Overlay */}
<MissionStartOverlay
  mission={activeMission}
  onComplete={() => {
    if (activeMission) {
      const world = character;
      router.push(`/mission/${world}/${activeMission.id}`);
    }
  }}
/>

    </div>
  );
}
