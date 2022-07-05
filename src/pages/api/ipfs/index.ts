import formidable from "formidable";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { File, NFTStorage } from "nft.storage";

const client: NFTStorage = new NFTStorage({
  token: process.env.NFT_STORAGE_API_KEY!,
});

const uploadToIPFS = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> => {
  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Could not update .",
      });
    }

    const { name, description } = fields;
    const { image } = files as any;

    const oldpath = image[0].filepath;
    const uploadedFile = fs.readFileSync(oldpath);
    const imageBuffer = Buffer.from(uploadedFile);

    const extension = image[0].mimetype.replace("image/", "");
    const fileName = `${name[0]}.${extension}`;

    const file = new File([imageBuffer], fileName, { type: image[0].mimetype });

    const nft = {
      image: file,
      name: name[0],
      description: description[0],
    };

    // call client.store, passing in the image & metadata
    const clientResponse = await client.store(nft);

    return res.status(200).json(clientResponse);
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case "POST":
      return uploadToIPFS(req, res);
    default:
      return res.status(405).end({ error: `Method ${method} Not Allowed` });
  }
};

export default handler;

// Disable default bodyParser to allow Formidable
export const config = {
  api: {
    bodyParser: false,
  },
};
