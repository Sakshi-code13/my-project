await db.collection("users").updateOne(
  { email: session.user.email },
  { $set: { name: session.user.name, image: session.user.image }, $inc: { xp: gainedXp } },
  { upsert: true }
);
