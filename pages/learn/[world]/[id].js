import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LearnScene from "../../../components/LearnScene";
import { jenkinsLearnScenes } from "../../../data/learnScenes/jenkins";

export default function LearnPage() {
  const router = useRouter();
  const { world, id } = router.query;
  const [scene, setScene] = useState(null);

  useEffect(() => {
    if (world === "jenkins") {
      const found = jenkinsLearnScenes.find((s) => s.id === parseInt(id));
      setScene(found || null);
    }
  }, [world, id]);

  if (!scene)
    return (
      <div className="h-screen w-screen bg-black text-green-400 flex items-center justify-center">
        Loading Learn Scene...
      </div>
    );

  return (
    <LearnScene
      scene={scene}
      onFinish={() => {
        // ✅ Mark that the user completed the Learn phase
        localStorage.setItem(`learned-${world}-${id}`, "true");

        // ✅ Move to mission gameplay
        router.push(`/mission/${world}/${id}`);
      }}
    />
  );
}
