import type { NextApiRequest, NextApiResponse } from "next";
import { UserEntity } from "../../../types";
import { Supabase } from "../../../utils/supabase";

/**
 * Get listing record by ID.
 * @method PUT /api/listings/[id]
 * @returns an object of the listing.
 */
const getListingById = async (
  { query }: NextApiRequest,
  res: NextApiResponse
): Promise<UserEntity | void> => {
  const { id } = query;

  try {
    const { data: user, error } = await Supabase.from<UserEntity>("users")
      .update({ ...body })
      .match({ id: userId })
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case "GET":
      return getListingById(req, res);
    default:
      return res.status(405).end({ error: `Method ${method} Not Allowed` });
  }
};

export default handler;
