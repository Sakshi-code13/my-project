import { useRouter } from "next/router";
import { getNextAfterMission } from "@/data/progression";
import JenkinsMission5 from "@/components/missions/JenkinsMission5";

export default function MissionJenkins5() {
  const router = useRouter();
  const topic = "jenkins";
  const part = 5;

  const handleComplete = ({ xp }) => {
    console.log(`✅ Mission ${part} completed — +${xp} XP`);
    const nextPath = getNextAfterMission(topic, part);
    setTimeout(() => { window.location.href = nextPath; }, 800);
  };

  return <JenkinsMission5 onComplete={handleComplete} />;
}
