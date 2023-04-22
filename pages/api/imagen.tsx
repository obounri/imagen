import { NextApiRequest, NextApiResponse } from "next";
import Replicate from "replicate";

type Data = {
  imageGetURL: string;
};

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY as string,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!process.env.REPLICATE_API_KEY) {
    throw new Error(
      "The REPLICATE_API_KEY environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  const prediction = await replicate.predictions.create({
    version: "9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb",

    input: {
      prompt: 'mdjrny-v4 style ' + req.body.prompt,
      guidance_scale: 7,
    },
  });

  if (prediction?.error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: prediction.error }));
    return;
  }

  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
