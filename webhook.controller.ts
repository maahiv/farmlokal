import redis from "../cache/redis";

export async function webhookHandler(req, res) {
  const eventId = req.body.id;

  const exists = await redis.get(`event:${eventId}`);
  if (exists) {
    return res.status(200).send("Duplicate event ignored");
  }

  await redis.set(`event:${eventId}`, "1", "EX", 86400);

  // process event safely here

  res.status(200).send("Event processed");
}
