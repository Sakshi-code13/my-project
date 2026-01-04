// pages/mission/jenkins/9.js
import { useRouter } from "next/router";
import JenkinsMission9 from "@/components/missions/JenkinsMission9";
import { getNextAfterMission } from "@/data/progression";

export default function MissionJenkins9() {
  const router = useRouter();
  const topic = "jenkins";
  const part = 9;

  const handleComplete = ({ xp }) => {
    console.log(`✅ Mission ${part} completed — +${xp} XP`);
    const nextPath = getNextAfterMission(topic, part);
    // store XP (optional: localStorage or global state)
    localStorage.setItem("player_xp", parseInt(localStorage.getItem("player_xp") || 0) + xp);
    // redirect to next learning chapter
    setTimeout(() => {
      window.location.href = nextPath;
    }, 1500);
  };

  return <JenkinsMission9 onComplete={handleComplete} />;
}
