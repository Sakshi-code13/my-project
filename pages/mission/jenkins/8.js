import { useRouter } from "next/router";
import { getNextAfterMission } from "@/data/progression";
import JenkinsMission8 from "@/components/missions/JenkinsMission8";

export default function MissionJenkins8() {
  const router = useRouter();
  const topic = "jenkins";
  const part = 8;

  const handleComplete = ({ xp }) => {
    console.log(`✅ Mission ${part} completed — +${xp} XP`);
    const nextPath = getNextAfterMission(topic, part);
    setTimeout(() => { window.location.href = nextPath; }, 800);
  };

  return <JenkinsMission8 onComplete={handleComplete} />;
}
