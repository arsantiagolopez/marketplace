import type { NextApiRequest, NextApiResponse } from "next";
import { SellerProfileEntity, UserEntity } from "../../../types";
import { Supabase } from "../../../utils/supabase";

/**
 * @todo
 * Get seller profile by user ID
 * @mathod GET /api/sellers/[userId]
 * @returns
 */
const getSellerProfileByUserId = async (
  { body }: NextApiRequest,
  res: NextApiResponse
): Promise<SellerProfileEntity | void> => {
  const { walletAddress, fields } = body;

  let user: UserEntity | undefined = undefined;

  try {
    const { data, error } = await Supabase.from<UserEntity>("users")
      .update({ ...fields })
      .match({ walletAddress });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // if (data) {
    console.log("*** data: ", data);
    // }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case "GET":
      return getSellerProfileByUserId(req, res);
    default:
      return res.status(405).end({ error: `Method ${method} Not Allowed` });
  }
};

export default handler;
