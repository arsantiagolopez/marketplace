import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { UserSession } from "../types";

interface Response {
  userId?: string;
  session?: UserSession;
}

interface Props {
  req: NextApiRequest;
}

/**
 * Decode session JWT and return userId and session of user logged in.
 */
const getUserSessionAndId = async ({
  req,
}: Props): Promise<Response | undefined> => {
  const secret = process.env.SUPABASE_JWT_SECRET || "";

  // Sub is the user's ID
  const { sub: userId } = (await getToken({ req, secret })) || {};

  const session = (await getSession({ req })) as unknown as UserSession;

  return { userId, session };
};

export { getUserSessionAndId };
