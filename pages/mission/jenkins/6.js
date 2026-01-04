import { useRouter } from "next/router";
import { getNextAfterMission } from "@/data/progression";
import JenkinsMission6 from "@/components/missions/JenkinsMission6";

export default function MissionJenkins6() {
  const router = useRouter();
  const topic = "jenkins";
  const part = 6;

  const handleComplete = ({ xp }) => {
    console.log(`✅ Mission ${part} completed — +${xp} XP`);
    const nextPath = getNextAfterMission(topic, part);
    setTimeout(() => { window.location.href = nextPath; }, 800);
  };

  return <JenkinsMission6 onComplete={handleComplete} />;
}
