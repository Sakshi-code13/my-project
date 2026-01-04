import { useRouter } from "next/router";
import { getNextAfterMission } from "@/data/progression";
import JenkinsMission10 from "@/components/missions/JenkinsMission10";

export default function MissionJenkins10() {
  const router = useRouter();
  const topic = "jenkins";
  const part = 10;

  const handleComplete = ({ xp }) => {
    console.log(`✅ Mission ${part} completed — +${xp} XP`);
    const nextPath = getNextAfterMission(topic, part);
    setTimeout(() => { window.location.href = nextPath; }, 800);
  };

  return <JenkinsMission10 onComplete={handleComplete} />;
}
