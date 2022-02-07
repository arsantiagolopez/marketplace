import type { NextApiRequest, NextApiResponse } from "next";
import { ItemEntity, ItemPriceEntity } from "../../../types";
import { getUserSessionAndId } from "../../../utils/getUserSessionAndId";
import { Supabase } from "../../../utils/supabase";

/**
 * Get all my items.
 * @method GET /api/items
 * @returns an array of objects of items.
 */
const getMyItems = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<ItemEntity[] | null | void> => {
  let items: ItemEntity[] = [];

  try {
    const { userId } = (await getUserSessionAndId({ req })) || {};

    if (!userId) {
      return res.status(400).json({
        error: "Must be authenticated to get your items.",
      });
    }

    let { data, error } = await Supabase.from<ItemEntity>("items")
      .select(`*, price: itemPrices(selectCurrency, usd, eth, lockedEthRate)`)
      .match({ userId });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // User does not have any items
    if (data && !data.length) {
      return null;
    }

    if (data) {
      items = data.map((item) => {
        const { price } = item as any;
        return { ...item, price: price[0] };
      });
    }

    return res.status(200).json(items);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

/**
 * Create an item record.
 * @method POST /api/items
 * @returns an object of the created item.
 */
const createItem = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<ItemEntity | void> => {
  const { body } = req;
  const { prices, ...rest } = body;

  try {
    const { userId, session } = (await getUserSessionAndId({ req })) || {};

    if (!userId) {
      return res.status(400).json({
        error: "Must be authenticated to create an item.",
      });
    }

    if (!session?.user?.isSeller) {
      return res.status(400).json({
        error: "Must be a seller to create an item.",
      });
    }

    const { data: item, error } = await Supabase.from<ItemEntity>("items")
      .insert({ userId, ...rest })
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { error: priceError } = await Supabase.from<ItemPriceEntity>(
      "itemPrices"
    )
      .insert({
        ...prices,
        itemId: item?.id,
      })
      .single();

    if (priceError) {
      return res.status(400).json({ error: priceError.message });
    }

    return res.status(200).json(item);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case "GET":
      return getMyItems(req, res);
    case "POST":
      return createItem(req, res);
    default:
      return res.status(405).end({ error: `Method ${method} Not Allowed` });
  }
};

export default handler;
