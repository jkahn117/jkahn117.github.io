import { Agent, CredentialSession } from "@atproto/api"

export async function createAgent(handle: string, password: string) {
  const session = new CredentialSession(new URL("https://bsky.social"))
  await session.login({ identifier: handle, password })
  return new Agent(session)
}
