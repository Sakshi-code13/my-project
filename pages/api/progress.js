import clientPromise from "../../lib/mongodb"; // adjust path if needed
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]"; // adjust path

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { gainedXp = 0 } = req.body;

    const client = await clientPromise;
    const db = client.db();

    await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          name: session.user.name,
          image: session.user.image,
        },
        $inc: { xp: gainedXp },
      },
      { upsert: true }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Progress API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
