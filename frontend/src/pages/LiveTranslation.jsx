import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function LiveTranslation() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const isPredictingRef = useRef(false);
  const lastRequestRef = useRef(0);

  const [predictedWord, setPredictedWord] = useState("Show hand gesture");
  const [wordSuggestions, setWordSuggestions] = useState([]);
  const [sentenceSuggestions, setSentenceSuggestions] = useState([]);
  const [handDetected, setHandDetected] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [status, setStatus] = useState("Ready");

  const toggleCamera = async () => {
    if (!cameraRef.current) return;
    if (cameraOn) {
      cameraRef.current.stop();
      setCameraOn(false);
      setStatus("Camera off");
    } else {
      await cameraRef.current.start();
      setCameraOn(true);
      setStatus("Camera on");
    }
  };

  const copyToClipboard = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied to clipboard!");
      setTimeout(() => setStatus("Ready"), 2000);
    } catch (error) {
      setStatus("Failed to copy");
    }
  };

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    const buildFeatureVector = (landmarks, handednessLabel) => {
      const usesTwoHands = 0;
      const leftHand = new Array(63).fill(0);
      const rightHand = new Array(63).fill(0);
      const flattened = landmarks.flatMap((landmark) => [landmark.x, landmark.y, landmark.z]);

      if (handednessLabel?.toLowerCase().includes("left")) {
        leftHand.splice(0, 63, ...flattened);
      } else {
        rightHand.splice(0, 63, ...flattened);
      }

      return [usesTwoHands, ...leftHand, ...rightHand];
    };

    const sendLandmarks = async (features) => {
      const now = Date.now();
      if (isPredictingRef.current || now - lastRequestRef.current < 500) {
        return;
      }
      isPredictingRef.current = true;
      lastRequestRef.current = now;
      setStatus("Predicting...");

      try {
        // First, get word prediction
        const wordResponse = await fetch(`${API_URL}/predict-word`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ features }),
        });

        if (wordResponse.ok) {
          const wordData = await wordResponse.json();
          if (wordData.success) {
            setPredictedWord(wordData.predicted_word);
            setWordSuggestions(wordData.word_suggestions || []);
          }
        }

        // Then, get sentence prediction
        const sentenceResponse = await fetch(`${API_URL}/predict-sentence`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ features }),
        });

        if (sentenceResponse.ok) {
          const sentenceData = await sentenceResponse.json();
          if (sentenceData.success) {
            setSentenceSuggestions(sentenceData.sentence_suggestions || []);
          }
        }

        setStatus("Updated");
      } catch (error) {
        setStatus("Connection error");
        setPredictedWord("Error");
      } finally {
        isPredictingRef.current = false;
      }
    };

    hands.onResults((results) => {
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;

      const canvasCtx = canvasElement.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      if (results.image) {
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
      }

      if (results.multiHandLandmarks?.length > 0) {
        setHandDetected(true);
        const firstHandLandmarks = results.multiHandLandmarks[0];
        const handednessLabel = results.multiHandedness?.[0]?.label ?? "Right";

        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(canvasCtx, landmarks, Hands.HAND_CONNECTIONS, { color: "#38bdf8", lineWidth: 4 });
          drawLandmarks(canvasCtx, landmarks, { color: "#f472b6", lineWidth: 2 });
        }

        const featureVector = buildFeatureVector(firstHandLandmarks, handednessLabel);
        if (featureVector.length === 127) {
          sendLandmarks(featureVector);
        }
      } else {
        setHandDetected(false);
        setPredictedWord("Show hand gesture");
        setWordSuggestions([]);
        setSentenceSuggestions([]);
        setStatus("No hand detected");
      }

      canvasCtx.restore();
    });

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current });
        },
        width: 1280,
        height: 720,
      });

      camera.start().then(() => {
        cameraRef.current = camera;
      }).catch((err) => {
        alert("Failed to acquire camera feed: " + err.message);
      });
    }

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      hands.close();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Webcam Section */}
      <section className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40 dark:border-slate-200 dark:bg-white/90">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Webcam Feed */}
          <div className="lg:col-span-2">
            <div className="relative rounded-[1.5rem] overflow-hidden border-4 border-slate-700 dark:border-slate-300 bg-black">
              <video
                ref={videoRef}
                className="hidden"
              />
              <canvas
                ref={canvasRef}
                className="w-full h-auto"
                width={1280}
                height={720}
              />
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-black/50 backdrop-blur text-white text-sm font-semibold">
                {handDetected ? "🟢 Hand detected" : "⚫ No hand"}
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={toggleCamera}
                className="flex-1 px-4 py-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition shadow-lg shadow-indigo-500/25"
              >
                {cameraOn ? "📷 Camera On" : "📷 Camera Off"}
              </button>
              <div className="flex-1 px-4 py-3 rounded-full bg-slate-800 dark:bg-slate-200 text-slate-100 dark:text-slate-900 font-semibold text-center">
                {status}
              </div>
            </div>
          </div>

          {/* Prediction Display */}
          <div className="space-y-4">
            {/* Predicted Word */}
            <div className="rounded-[1.5rem] border-2 border-indigo-400 bg-indigo-950/40 dark:bg-indigo-50 p-6">
              <h3 className="text-sm uppercase tracking-widest text-indigo-300 dark:text-indigo-700 font-semibold">
                Predicted Word
              </h3>
              <p className="mt-3 text-3xl font-bold text-white dark:text-slate-950 truncate">
                {predictedWord}
              </p>
              <button
                onClick={() => copyToClipboard(predictedWord)}
                className="mt-4 w-full px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition text-sm"
              >
                📋 Copy
              </button>
            </div>

            {/* Word Suggestions */}
            {wordSuggestions.length > 0 && (
              <div className="rounded-[1.5rem] border border-slate-700 dark:border-slate-300 bg-slate-800/50 dark:bg-slate-50 p-4">
                <h4 className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-600 font-semibold">
                  Other suggestions
                </h4>
                <div className="mt-3 space-y-2">
                  {wordSuggestions.slice(1, 4).map((word, idx) => (
                    <button
                      key={idx}
                      onClick={() => copyToClipboard(word)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 dark:bg-slate-200 dark:hover:bg-slate-300 text-slate-100 dark:text-slate-900 text-sm font-medium transition"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sentence Suggestions */}
      {sentenceSuggestions.length > 0 && (
        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-xl shadow-slate-950/20 dark:border-slate-200 dark:bg-white/90">
          <h2 className="text-2xl font-bold text-white dark:text-slate-950">Suggested Sentences</h2>
          <p className="mt-2 text-slate-400 dark:text-slate-700">Click any sentence to copy it</p>
          
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sentenceSuggestions.map((sentence, idx) => (
              <button
                key={idx}
                onClick={() => copyToClipboard(sentence)}
                className="p-4 rounded-[1.25rem] border border-slate-700 dark:border-slate-300 bg-slate-800/50 dark:bg-slate-50 hover:bg-slate-700 dark:hover:bg-slate-100 text-slate-100 dark:text-slate-900 font-medium transition text-left"
              >
                {sentence}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-xl shadow-slate-950/20 dark:border-slate-200 dark:bg-white/90">
        <h2 className="text-2xl font-bold text-white dark:text-slate-950">How It Works</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-[1.25rem] border border-slate-700 dark:border-slate-300 bg-slate-800/50 dark:bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-white dark:text-slate-950">Show Gesture</h3>
            <p className="mt-2 text-slate-400 dark:text-slate-700">
              Make any hand gesture in front of the camera
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-slate-700 dark:border-slate-300 bg-slate-800/50 dark:bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-white dark:text-slate-950">Get Prediction</h3>
            <p className="mt-2 text-slate-400 dark:text-slate-700">
              See the predicted word appear instantly
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-slate-700 dark:border-slate-300 bg-slate-800/50 dark:bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-white dark:text-slate-950">Copy & Use</h3>
            <p className="mt-2 text-slate-400 dark:text-slate-700">
              Copy to clipboard or select sentence suggestions
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
