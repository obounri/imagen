// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

type Data = {
  generatedPrompt: string;
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "The OPENAI_API_KEY environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content:
          "You are a Midjourney v4 prompt engineer who, given some keywords, generate a creative description of an image, that will be given to Midjourney to generate.",
      },
      {
        role: "user",
        content: `From these simple keywords: 'An elegant female elf', generate a short image description: background, colors, angles, lighting, camera used, a style of art. Concise, two or three lines maximum`,
      },
      {
        role: "assistant",
        content: `portrait of female elf, intricate, elegant, highly detailed, digital painting, artstation, concept art, smooth, sharp focus, illustration, art by artgerm and greg rutkowski and alphonse mucha, 8k`,
      },
      {
        role: "user",
        content: `From these simple keywords: 'A big mosque hall with stained glasses', generate a short image description: background, colors, angles, lighting, camera used, a style of art. Concise, two or three lines maximum`,
      },
      {
        role: "assistant",
        content: `Wide-angle shot of a grand mosque hall, vibrant stained glass windows casting colorful lightnto the ornate marble floors, warm and inviting lighting, captured with a high-resolution DSLR camera, reminiscent of Islamic architecture found in the Middle East, inspired by Islamic geometric patterns.`,
      },
      {
        role: "user",
        content: `From these simple keywords: '${req.body.prompt}', generate a short image description: background, colors, angles, lighting, camera used, a style of art. Concise, two or three lines maximum`,
      },
    ],
    max_tokens: 80,
  });
  // if (error) {
  // }

  res.statusCode = 201;
  res.end(JSON.stringify(response.data.choices[0].message?.content));
}
