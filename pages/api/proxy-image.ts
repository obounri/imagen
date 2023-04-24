import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const imageUrl = req.query.url as string;

  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    res.setHeader("Content-Type", response.headers["content-type"]);
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=generated_art_prompt.png"
    );
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.send(buffer);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Error fetching image" });
  }
}
