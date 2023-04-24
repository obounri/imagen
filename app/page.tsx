"use client";

import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { useState } from "react";
import ImageForm from "./components/form";
import LoadingSpinner from "./components/loadingSpinner";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [formKeywords, setFormKeywords] = useState("");
  const [lockSubmit, setLockSubmit] = useState(false);

  const downloadImage = () => {
    toast.info("Downloading image...", { autoClose: 1500 });
    const link = document.createElement("a");
    link.href = `/api/proxy-image?url=${encodeURIComponent(generatedImage)}`;
    link.download = "generated_art_prompt.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateImage = async (keywords: string) => {
    setLockSubmit(true);
    let genPromptToastId;
    let loadingToastId;
    try {
      genPromptToastId = toast.info(
        "Generating creative prompt for Midjourney...",
        {
          autoClose: false,
          closeOnClick: false,
        }
      );

      const completionResponse = await axios.post(
        "api/chat",
        {
          prompt: keywords,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
        }
      );

      setGeneratedPrompt(completionResponse.data);
      setFormKeywords(keywords);

      toast.dismiss(genPromptToastId);
      loadingToastId = toast.info("Generating image...", {
        autoClose: false,
        closeOnClick: false,
      });

      console.log("before call to api/imagen in page.ts");

      const response = await axios.post(
        "api/imagen",
        {
          prompt: completionResponse.data,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
        }
      );

      let getResponse;
      while (1) {
        getResponse = await axios.get(`/api/getimage?id=${response.data.id}`, {
          headers: {
            // "Content-Type": "application/json",
            // Authorization: `Bearer ${process.env.NEXT_PUBLIC_REPLICATE_API_KEY}`,
          },
        });
        console.log(getResponse.data.status);
        if (getResponse.status !== 200) {
          console.log("error here");
          break;
        } else if (
          getResponse.data.status === "succeeded" ||
          getResponse.data.status === "failed"
        )
          break;
        await sleep(3000);
      }

      if (getResponse?.data.status === "succeeded") {
        const imageUrl = getResponse.data.output[0];
        setGeneratedImage(imageUrl);
        toast.dismiss(loadingToastId);
        toast.success("Image generated successfully!", { autoClose: 3000 });
      } else {
        console.log("failure");
        toast.dismiss(loadingToastId);
        toast.warning("Image not generated! Yet?", { autoClose: 3000 });
      }
      // Dismiss the loading toast and show a success toast
    } catch (error) {
      console.error("Error generating image:", error);
      // Dismiss the loading toast and show an error toast
      // genPromptToastId ? toast.dismiss(genPromptToastId) : null;
      loadingToastId ? toast.dismiss(loadingToastId) : null;
      toast.error("Failed to generate image. Please try again.", {
        autoClose: 3000,
      });
    }
    setLockSubmit(false);
  };

  return (
    // <>
    // <head />
    <main className={styles.main}>
      <h1>AI Art Generator ft. GPT, replicate/Openjourney</h1>

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
                setGeneratedImage(""),
                  setGeneratedPrompt(""),
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
            <button className={styles.regen} onClick={downloadImage}>
              Download Image
            </button>
          </div>
        </>
      ) : lockSubmit === false ? (
        <ImageForm onSubmit={generateImage} />
      ) : (
        <LoadingSpinner />
      )}
      <ToastContainer position="bottom-center" />
    </main>
    // </>
  );
}
// A crowd of moroccan feminist women fighting for women's rights in a public strike
// A sea otter waiting for the bus
