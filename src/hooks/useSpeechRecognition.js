import { useCallback, useEffect, useRef, useState } from "react";

function getRecognitionConstructor() {
  if (typeof window === "undefined") return null;

  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function getErrorMessage(error) {
  const messages = {
    "audio-capture": "No microphone was found. Check your device and try again.",
    "not-allowed": "Microphone permission was not granted.",
    "service-not-allowed": "Speech recognition is not allowed in this browser.",
    network: "Speech recognition needs a network connection in this browser.",
  };

  return messages[error] || "Speech recognition could not start. Please try again.";
}

export function useSpeechRecognition({ onComplete }) {
  const recognitionRef = useRef(null);
  const finalTextRef = useRef("");
  const shouldSubmitRef = useRef(false);
  const hasErrorRef = useRef(false);
  const [error, setError] = useState("");
  const [finalText, setFinalText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [status, setStatus] = useState("idle");
  const isSupported = Boolean(getRecognitionConstructor());

  const cancel = useCallback(() => {
    shouldSubmitRef.current = false;
    recognitionRef.current?.abort();
    recognitionRef.current = null;
  }, []);

  const start = useCallback(() => {
    const Recognition = getRecognitionConstructor();

    if (!Recognition) {
      setError("Speech recognition is unavailable in this browser.");
      setStatus("unsupported");
      return;
    }

    if (recognitionRef.current) return;

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognitionRef.current = recognition;
    finalTextRef.current = "";
    shouldSubmitRef.current = false;
    hasErrorRef.current = false;
    setError("");
    setFinalText("");
    setInterimText("");
    setStatus("starting");

    recognition.onstart = () => setStatus("listening");
    recognition.onresult = (event) => {
      let nextFinalText = finalTextRef.current;
      let nextInterimText = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const resultText = event.results[index][0].transcript;

        if (event.results[index].isFinal) {
          nextFinalText += `${resultText} `;
        } else {
          nextInterimText += resultText;
        }
      }

      finalTextRef.current = nextFinalText;
      setFinalText(nextFinalText.trim());
      setInterimText(nextInterimText.trim());
    };
    recognition.onerror = (event) => {
      if (event.error === "aborted") return;

      hasErrorRef.current = true;
      setError(getErrorMessage(event.error));
      setStatus("error");
    };
    recognition.onend = () => {
      const completedText = finalTextRef.current.trim();
      const shouldSubmit = shouldSubmitRef.current;

      recognitionRef.current = null;
      shouldSubmitRef.current = false;
      setInterimText("");

      if (hasErrorRef.current) return;

      setStatus("idle");

      if (shouldSubmit && completedText) {
        onComplete(completedText);
        finalTextRef.current = "";
        setFinalText("");
      } else if (shouldSubmit) {
        setError("No speech was captured. Try again and finish your turn after speaking.");
      }
    };

    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setError("Speech recognition could not start. Please try again.");
      setStatus("error");
    }
  }, [onComplete]);

  const finish = useCallback(() => {
    if (!recognitionRef.current) return;

    shouldSubmitRef.current = true;
    setStatus("finishing");
    recognitionRef.current.stop();
  }, []);

  useEffect(() => () => cancel(), [cancel]);

  return {
    error,
    finalText,
    finish,
    interimText,
    isSupported,
    start,
    status,
  };
}
