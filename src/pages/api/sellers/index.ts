import type { NextApiRequest, NextApiResponse } from "next";
import { SellerProfileEntity } from "../../../types";
import { getUserSessionAndId } from "../../../utils/getUserSessionAndId";
import { Supabase } from "../../../utils/supabase";

/**
 * Get my seller profile.
 * @mathod GET /api/sellers
 * @returns a object of my seller profile.
 */
const getMySellerProfile = async (
  _: NextApiRequest,
  res: NextApiResponse,
  userId: string
): Promise<SellerProfileEntity | null | void> => {
  let profile: SellerProfileEntity | null = null;

  try {
    const { data, error } = await Supabase.from<SellerProfileEntity>(
      "sellerProfiles"
    )
      .select("*")
      .match({ userId });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // User does not have a seller profile
    if (data && !data.length) {
      return null;
    }

    if (data) {
      profile = data[0];
    }

    return res.status(200).json(profile);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

/**
 * Create your seller profile.
 * @method POST /api/sellers
 * @returns an object of the created seller profile.
 */
const createSellerProfile = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
): Promise<SellerProfileEntity | void> => {
  const { body } = req;

  let profile: SellerProfileEntity | null = null;

  try {
    // Check if seller profile exists
    const { data, error } = await Supabase.from<SellerProfileEntity>(
      "sellerProfiles"
    )
      .select("*")
      .match({ userId });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Profile doesn't exist, create one
    if (data && !data.length) {
      const { data } = await Supabase.from<SellerProfileEntity>(
        "sellerProfiles"
      )
        .insert({ ...body, userId })
        .single();
      profile = data;
    }
    // Update my seller profile
    else {
      const { data: sellerProfile } = await Supabase.from<SellerProfileEntity>(
        "sellerProfiles"
      )
        .update({ ...body, userId })
        .match({ userId })
        .limit(1)
        .single();
      profile = sellerProfile;
    }

    return res.status(200).json(profile);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

/**
 * Update seller profile by user ID.
 * @mathod PUT /api/sellers
 * @returns an object of the updated seller profile.
 */
const updateSellerProfile = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
): Promise<SellerProfileEntity | void> => {
  const { body } = req;

  let profile: SellerProfileEntity | null = null;

  try {
    // Check if seller profile exists
    const { data, error } = await Supabase.from<SellerProfileEntity>(
      "sellerProfiles"
    )
      .select("*")
      .match({ userId });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Profile doesn't exist, create new with updates
    if (data && !data.length) {
      const { data } = await Supabase.from<SellerProfileEntity>(
        "sellerProfiles"
      )
        .insert({ ...body, userId })
        .single();
      profile = data;
    }
    // Profile exists, update
    else {
      const { data } = await Supabase.from<SellerProfileEntity>(
        "sellerProfiles"
      )
        .update({ ...body, userId })
        .single();
      profile = data;
    }

    return res.status(200).json(profile);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  const { userId } = (await getUserSessionAndId({ req })) || {};

  if (!userId) {
    return res.status(400).json({
      error: "Must be authenticated to create your seller profile.",
    });
  }

  switch (method) {
    case "GET":
      return getMySellerProfile(req, res, userId);
    case "POST":
      return createSellerProfile(req, res, userId);
    case "PUT":
      return updateSellerProfile(req, res, userId);
    default:
      return res.status(405).end({ error: `Method ${method} Not Allowed` });
  }
};

export default handler;
