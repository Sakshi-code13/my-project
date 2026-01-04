import { useRouter } from "next/router";
import { getNextAfterMission } from "@/data/progression";
import JenkinsMission12 from "@/components/missions/JenkinsMission12";

export default function MissionJenkins12() {
  const router = useRouter();
  const topic = "jenkins";
  const part = 12;

  const handleComplete = ({ xp }) => {
    console.log(`✅ Mission ${part} completed — +${xp} XP`);
    const nextPath = getNextAfterMission(topic, part);
    setTimeout(() => { window.location.href = nextPath; }, 800);
  };

  return <JenkinsMission12 onComplete={handleComplete} />;
}
