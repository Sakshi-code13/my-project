import { useRouter } from "next/router";
import { getNextAfterMission } from "@/data/progression";
import JenkinsMission1 from "@/components/missions/JenkinsMission1";

export default function MissionJenkins1() {
  const router = useRouter();
  const topic = "jenkins";
  const part = 1;

  const handleComplete = ({ xp }) => {
    console.log(`✅ Mission ${part} completed — +${xp} XP`);
    const nextPath = getNextAfterMission(topic, part);
    setTimeout(() => { window.location.href = nextPath; }, 800);
  };

  return <JenkinsMission1 onComplete={handleComplete} />;
}
