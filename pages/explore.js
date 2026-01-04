import ExploreMap from "@/components/ui/ExploreMap";

const exploreData = [
  { id: 1, title: "Intro to Jenkins" },
  { id: 2, title: "Setting Up CI/CD" },
  { id: 3, title: "Pipelines Basics" },
  { id: 4, title: "Pipeline Syntax" },
  { id: 5, title: "Plugins & Integrations" },
  { id: 6, title: "Build Triggers" },
  { id: 7, title: "Declarative vs Scripted" },
  { id: 8, title: "Agents & Nodes" },
  { id: 9, title: "Artifacts & Archiving" },
  { id: 10, title: "Blue Ocean UI" },
  { id: 11, title: "Jenkinsfile Best Practices" },
  { id: 12, title: "Scaling Jenkins" },
];

export default function ExplorePage() {
  return (
    <div className="p-8 text-center text-green-300">
      <h1 className="text-3xl font-bold mb-4 text-green-400">🧭 Explore Jenkins World</h1>
      <p className="text-gray-400 mb-10">
        Tap on any glowing node to begin your next Learn session.
      </p>
      <ExploreMap learns={exploreData} />
    </div>
  );
}
