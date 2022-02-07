import type { NextApiRequest, NextApiResponse } from "next";
import { ItemEntity, ListingEntity, ListingPriceEntity } from "../../../types";
import { getUserSessionAndId } from "../../../utils/getUserSessionAndId";
import { Supabase } from "../../../utils/supabase";

/**
 * Get listing record by ID.
 * @method GET /api/listings/[id]
 * @returns an object of the listing.
 */
const getListingById = async (
  { query }: NextApiRequest,
  res: NextApiResponse
): Promise<ListingEntity | null | void> => {
  const { id } = query;

  let listing: ListingEntity | null = null;
  let items: ItemEntity[] = [];

  try {
    const { data, error } = await Supabase.from<ListingEntity>("listings")
      .select(`*, items(*, price: itemPrices(*)), price: listingPrices(*)`)
      .match({ id });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Listing doesn't exist
    if (data && !data.length) {
      return null;
    }

    if (data) {
      let { price, items: listingItems } = data[0] as any;
      listing = { ...data[0], price: price[0] };

      // Remove array from individual item prices
      if (listingItems) {
        for (let item of listingItems) {
          const { price } = item;
          item = { ...item, price: price[0] };
          items.push(item);
        }
        listing = { ...listing, items };
      }
    }

    return res.status(200).json(listing);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

/**
 * Update listing record by ID.
 * @method PUT /api/listings/[id]
 * @returns an object of the updated listing.
 */
const updateListingById = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<ListingEntity | null | void> => {
  const { body, query } = req;
  const { id } = query;
  const { prices, ...rest } = body;

  let listing: ListingEntity | null = null;

  try {
    const { userId } = (await getUserSessionAndId({ req })) || {};

    if (!userId) {
      return res
        .status(400)
        .json({ error: "Must be authenticated to update your profile." });
    }

    if (prices) {
      // Update listingPrices table

      const { error } = await Supabase.from<ListingPriceEntity>("listingPrices")
        .update({ ...prices })
        .match({ listingId: id })
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }
    } else {
      // Updated all other fields
      const { data, error } = await Supabase.from<ListingEntity>("listings")
        .update({ ...rest })
        .match({ id })
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      if (data) {
        listing = data;
      }
    }

    return res.status(200).json(listing);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case "GET":
      return getListingById(req, res);
    case "PUT":
      return updateListingById(req, res);
    default:
      return res.status(405).end({ error: `Method ${method} Not Allowed` });
  }
};

export default handler;
