import { useRouter } from "next/router";
import { getNextAfterMission, getMissionXp } from "@/data/progression";
import JenkinsMission4 from "@/components/missions/JenkinsMission4";

export default function MissionJenkins4() {
  const router = useRouter();

  const handleComplete = ({ xp }) => {
    const topic = "jenkins";
    const part = 4;
    const totalXp = parseInt(localStorage.getItem("xp") || "0", 10) + getMissionXp(topic, part);

    localStorage.setItem("xp", String(totalXp));
    localStorage.setItem(`mission-${topic}-${part}`, "completed");
    localStorage.setItem("current-path", `learn-${topic}-${part + 1}`);

    const next = getNextAfterMission(topic, part);
    router.push(next);
  };

  return <JenkinsMission4 onComplete={handleComplete} />;
}
