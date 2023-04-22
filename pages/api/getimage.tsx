import { NextApiRequest, NextApiResponse } from "next";
import Replicate, { Prediction } from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY as string,
});

export default async function handler(req: any, res: NextApiResponse<Prediction>) {
  const prediction = await replicate.predictions.get(req.query.id);

  if (prediction?.error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: prediction.error }));
    return;
  }

  res.status(200).json(prediction);
}
