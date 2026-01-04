import { useRouter } from "next/router";
import { getNextAfterMission } from "@/data/progression";
import JenkinsMission2 from "@/components/missions/JenkinsMission2";

export default function MissionJenkins2() {
  const router = useRouter();
  const topic = "jenkins";
  const part = 2;

  const handleComplete = ({ xp }) => {
    console.log(`✅ Mission ${part} completed — +${xp} XP`);
    const nextPath = getNextAfterMission(topic, part);
    setTimeout(() => { window.location.href = nextPath; }, 800);
  };

  return <JenkinsMission2 onComplete={handleComplete} />;
}
