import axios from "axios";

interface Props {
  /* IPNFT CID identifier */
  cid: string;
  /* What property to read from JSON? Image, name, description? */
  property: string;
}

const readIPFSField = async ({ cid, property }: Props): Promise<string> => {
  const uri = `https://${cid}.ipfs.dweb.link/metadata.json`;

  const { data, status } = await axios.get(uri);

  if (status !== 200) {
    return "";
  }

  switch (property) {
    case "name":
      return data.name;

    case "image":
      // Get image extension
      const extension = data.image.split(".").pop();
      // Encode name
      const name = encodeURIComponent(data.name);
      // Create slug
      const slug = `${name}.${extension}`;
      return `https://${cid}.ipfs.dweb.link/image/${slug}`;

    case "description":
      return data.description;

    default:
      return "";
  }
};

export { readIPFSField };
