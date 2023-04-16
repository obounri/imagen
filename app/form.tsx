import styles from "./form.module.css";
import { ChangeEvent, FormEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ImageFormProps {
  onSubmit: (prompt: string) => void;
}

const ImageForm = ({ onSubmit }: ImageFormProps) => {
  const [prompt, setPrompt] = useState("");

  const isValidInput = (input: string) => {
    // Check if input is not empty and contains only alpha characters (with optional spaces)
    return input.trim() !== "" && /^[a-zA-Z\s]+$/.test(input);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isValidInput(prompt)) {
      onSubmit(prompt);
    } else {
      toast.warning("Invalid input.", {
        autoClose: 1500,
      });
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.formInput}
          type="text"
          id="prompt"
          value={prompt}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPrompt(e.target.value)
          }
          placeholder="Prompt"
        />
        <button className={styles.formButton} type="submit">
          Generate Image
        </button>
      </form>
      <ToastContainer position="bottom-center" />
    </>
  );
};

export default ImageForm;
