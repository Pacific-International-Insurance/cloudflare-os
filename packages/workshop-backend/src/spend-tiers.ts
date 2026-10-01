// Pacific: per-user spend tiers. The tier rides on AI Gateway request metadata so the gateway's
// spend-limit rules can give each tier its own per-user budget. Inactive unless TIERS is set.

/** A user's spend tier. Users in neither list are viewers, whom the gateway gives no budget. */
export type SpendTier = "viewer" | "basic" | "advanced";

type TierLists = { basic?: string[]; advanced?: string[] };

/**
 * Resolve the spend tier for a user ID (an Access-verified email in Cloudflare Access mode).
 * Returns undefined when TIERS is not configured, which leaves gateway metadata exactly as
 * upstream sends it. Matching ignores case; a user in both lists is advanced.
 */
export function resolveSpendTier(env: Cloudflare.Env, userId: string): SpendTier | undefined {
  let tiers: unknown = env.TIERS;
  if (!tiers) return undefined;

  if (typeof tiers === "string") {
    // Same convention as ADMINS: a JSON binding, or the same value as a JSON string.
    tiers = JSON.parse(tiers);
  }
  if (typeof tiers !== "object" || tiers === null || Array.isArray(tiers)) {
    throw new TypeError("TIERS must be an object of { basic?, advanced? } email arrays.");
  }

  let lists = tiers as TierLists;
  let id = userId.toLowerCase();
  if (isListed(lists.advanced, id)) return "advanced";
  if (isListed(lists.basic, id)) return "basic";
  return "viewer";
}

function isListed(list: unknown, id: string): boolean {
  if (list === undefined) return false;
  if (!Array.isArray(list)) {
    throw new TypeError("TIERS lists must be arrays of email addresses.");
  }
  return list.some((entry) => typeof entry === "string" && entry.toLowerCase() === id);
}
