import { jenkinsMissions } from "../../../../data/missions/jenkins";

export default function handler(req, res) {
  const { world } = req.query;

  if (world === "jenkins") {
    return res.status(200).json({ missions: jenkinsMissions });
  }

  return res.status(404).json({ error: "World not supported" });
}
