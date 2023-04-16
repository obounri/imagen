"use client";

import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { useState } from "react";
import ImageForm from "./form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState(null);
  const [formKeywords, setFormKeywords] = useState("");

  const generateImage = async (keywords: string) => {
    let genPromptToastId;
    let loadingToastId;
    setFormKeywords(keywords);
    try {
      genPromptToastId = toast.info(
        "Generating creative prompt for DALL-E...",
        {
          autoClose: false,
          closeOnClick: false,
        }
      );

      const completionResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          temperature: 0.4,
          messages: [
            {
              role: "system",
              content:
                "You are a DALL-E prompt engineer who, given some keywords, generate a creative description of an image, that will be given to DALL-E to generate.",
            },
            {
              role: "user",
              content: `From these simple keywords: '${keywords}', add some short image description: background, colors, angles, lighting, camera used, a style of art. Concise, two or three lines maximum`,
            },
          ],
          max_tokens: 80,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
        }
      );

      setGeneratedPrompt(completionResponse.data.choices[0].message.content);

      toast.dismiss(genPromptToastId);
      loadingToastId = toast.info("Generating image...", {
        autoClose: false,
        closeOnClick: false,
      });

      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          prompt: generatedPrompt,
          size: "512x512",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
        }
      );

      // Get image URL from the response
      const imageUrl = response.data.data[0].url;
      setGeneratedImage(imageUrl);

      // Dismiss the loading toast and show a success toast
      toast.dismiss(loadingToastId);
      toast.success("Image generated successfully!", { autoClose: 3000 });
    } catch (error) {
      console.error("Error generating image:", error);
      // Dismiss the loading toast and show an error toast
      // genPromptToastId ? toast.dismiss(genPromptToastId) : null;
      loadingToastId ? toast.dismiss(loadingToastId) : null;
      toast.error("Failed to generate image. Please try again.", {
        autoClose: 3000,
      });
    }
  };

  return (
    <main className={styles.main}>
      <h1>AI Art Generator ft. GPT, DALLE-E</h1>

      {generatedImage ? (
        <>
          <p>{formKeywords}</p>
          <article className={styles.article}>
            {generatedPrompt ? (
              <p className={styles.generatedPrompt}>{generatedPrompt}</p>
            ) : null}
            <Image
              className={styles.generatedImage}
              src={generatedImage}
              alt="Generated Art Prompt"
              width={330}
              height={330}
            />
          </article>
          <div className={styles.buttons}>
            <button
              className={styles.regen}
              onClick={() => {
                setGeneratedImage(null),
                  setGeneratedPrompt(null),
                  setFormKeywords("");
              }}
            >
              Generate New Image
            </button>
            <button
              className={styles.regen}
              onClick={() => {
                // setGeneratedImage('tmp');
                generateImage(formKeywords);
              }}
            >
              Regenerate
            </button>
          </div>
        </>
      ) : (
        <ImageForm onSubmit={generateImage} />
      )}
      <ToastContainer position="bottom-center" />
    </main>
  );
}
// A crowd of moroccan feminist women fighting for women's rights in a public strike
// A sea otter waiting for the bus
