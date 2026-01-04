import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("devopsquest");

    // Fetch users sorted by XP descending
    const leaderboard = await db
      .collection("users")
      .find({}, { projection: { name: 1, xp: 1, image: 1, _id: 0 } })
      .sort({ xp: -1 })
      .limit(20)
      .toArray();

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error("Leaderboard fetch failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
