// src/auth/oauth.service.ts
import axios from "axios";
import redis from "../cache/redis";

const TOKEN_KEY = "oauth:access_token";
const LOCK_KEY = "oauth:lock";

export async function getAccessToken() {
  const cached = await redis.get(TOKEN_KEY);
  if (cached) return cached;

  const lock = await redis.set(LOCK_KEY, "1", "NX", "EX", 10);
  if (!lock) {
    await new Promise(r => setTimeout(r, 200));
    return getAccessToken();
  }

  const res = await axios.post("https://mock-oauth/token", {
    client_id: "abc",
    client_secret: "xyz",
    grant_type: "client_credentials"
  });

  await redis.set(
    TOKEN_KEY,
    res.data.access_token,
    "EX",
    res.data.expires_in - 30
  );

  await redis.del(LOCK_KEY);
  return res.data.access_token;
}
