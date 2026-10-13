import { useCallback, useEffect, useState } from "react";

export function useSpeechSynthesis() {
  const isSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const stop = useCallback(() => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();
    setStatus("idle");
  }, [isSupported]);

  const speak = useCallback(
    (text) => {
      if (!isSupported) {
        setError("Text-to-speech is unavailable in this browser.");
        setStatus("unsupported");
        return;
      }

      window.speechSynthesis.cancel();
      setError("");

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN";
      utterance.rate = 0.96;
      utterance.onstart = () => setStatus("speaking");
      utterance.onend = () => setStatus("idle");
      utterance.onerror = (event) => {
        if (event.error === "canceled" || event.error === "interrupted") {
          setStatus("idle");
          return;
        }

        setError("The browser could not play Rohit's voice.");
        setStatus("error");
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSupported],
  );

  useEffect(() => () => stop(), [stop]);

  return { error, isSupported, speak, status, stop };
}
