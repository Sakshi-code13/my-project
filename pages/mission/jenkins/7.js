import { useRouter } from "next/router";
import { getNextAfterMission } from "@/data/progression";
import JenkinsMission7 from "@/components/missions/JenkinsMission7";

export default function MissionJenkins7() {
  const router = useRouter();
  const topic = "jenkins";
  const part = 7;

  const handleComplete = ({ xp }) => {
    console.log(`✅ Mission ${part} completed — +${xp} XP`);
    const nextPath = getNextAfterMission(topic, part);
    setTimeout(() => { window.location.href = nextPath; }, 800);
  };

  return <JenkinsMission7 onComplete={handleComplete} />;
}
