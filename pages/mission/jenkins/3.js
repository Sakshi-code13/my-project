import { useRouter } from "next/router";
import { getNextAfterMission } from "@/data/progression";
import JenkinsMission3 from "@/components/missions/JenkinsMission3";

export default function MissionJenkins3() {
  const router = useRouter();
  const topic = "jenkins";
  const part = 3;

  const handleComplete = ({ xp }) => {
    console.log(`✅ Mission ${part} completed — +${xp} XP`);
    const nextPath = getNextAfterMission(topic, part);
    setTimeout(() => { window.location.href = nextPath; }, 800);
  };

  return <JenkinsMission3 onComplete={handleComplete} />;
}
