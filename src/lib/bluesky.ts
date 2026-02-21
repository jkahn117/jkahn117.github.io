import { Agent, CredentialSession } from "@atproto/api";

const session = new CredentialSession(new URL("https://bsky.social"));

try {
  await session.login({
    identifier: import.meta.env.BLUESKY_HANDLE,
    password: import.meta.env.BLUESKY_APP_PASSWORD,
  });
  console.log("🦋 Bluesky login successul");
} catch (err) {
  console.warn("⚠️ Bluesky login failed");
  console.warn(err);
  throw err;
}

const agent = new Agent(session);

export default agent;
