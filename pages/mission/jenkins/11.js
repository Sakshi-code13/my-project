import { useRouter } from "next/router";
import { getNextAfterMission } from "@/data/progression";
import JenkinsMission11 from "@/components/missions/JenkinsMission11";

export default function MissionJenkins11() {
  const router = useRouter();
  const topic = "jenkins";
  const part = 11;

  const handleComplete = ({ xp }) => {
    console.log(`✅ Mission ${part} completed — +${xp} XP`);
    const nextPath = getNextAfterMission(topic, part);
    setTimeout(() => { window.location.href = nextPath; }, 800);
  };

  return <JenkinsMission11 onComplete={handleComplete} />;
}
