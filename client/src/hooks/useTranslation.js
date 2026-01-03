import { useState } from "react";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.PROD
  ? "/api"
  : "http://localhost:3001/api";

const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);

  const translateText = async (text, targetLang = "en") => {
    try {
      setIsTranslating(true);
      const res = await fetch(`${API_BASE_URL}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify({
          text,
          to: targetLang,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Failed to translate message");
      return null;
    } finally {
      setIsTranslating(false);
    }
  };

  return { translateText, isTranslating };
};

export default useTranslation;
