import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";

interface Props {
  req: NextApiRequest;
}

/**
 * Decode session JWT and return ID of user logged in.
 */
const getUserId = async ({ req }: Props): Promise<string | undefined> => {
  const secret = process.env.SUPABASE_JWT_SECRET || "";
  const session = await getSession({ req });

  if (!session) return undefined;

  // Sub is the user's ID
  const { sub } = (await getToken({ req, secret })) || {};

  return sub;
};

export { getUserId };
