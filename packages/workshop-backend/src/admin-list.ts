// Pacific: Access passes the identity provider's spelling of the email through unchanged (Entra
// sends "Jesse.Skawinski@..."), while the ADMINS list is typed by hand. Email addresses are not
// case-sensitive in practice, so the admin check compares them that way.

/** Whether `name` (the signed-in user's email) appears in the ADMINS binding, ignoring case. */
export function isListedAdmin(admins: unknown, name: string): boolean {
  if (typeof admins === "string") {
    // Admins should be a JSON binding of array type, but `.env` doesn't actually let you
    // specify JSON bindings, so we also support a string that parses as JSON array.
    admins = JSON.parse(admins);
  }

  if (!Array.isArray(admins)) {
    throw new TypeError("ADMINS must be configured as an array of usernames.");
  }

  let wanted = name.toLowerCase();
  return admins.some((admin) => typeof admin === "string" && admin.toLowerCase() === wanted);
}
