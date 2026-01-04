// pages/api/progress/[world].js
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("devopsquest");
  const { world } = req.query;
  const playerId = "sakshi"; // eventually use real auth (for now static)

  if (req.method === "GET") {
    const progress = await db.collection("playerProgress").findOne({ world, playerId });
    if (!progress) {
      return res.status(200).json({ xp: 0, missions: [] });
    }
    return res.status(200).json(progress);
  }

  if (req.method === "POST") {
    const body = req.body && typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    // upsert player progress
    await db.collection("playerProgress").updateOne(
      { world, playerId },
      { $set: body },
      { upsert: true }
    );
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: "Method not allowed" });
}
