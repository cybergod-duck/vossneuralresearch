import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Helper to get GoogleGenAI client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Warning: GEMINI_API_KEY is not defined in environment variables.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "MOCK_KEY_FOR_BUILD",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Route: Analyze prompt for Voss Simulator
app.post("/api/analyze-prompt", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const ai = getGeminiClient();
    const systemInstruction = `You are a clinical neurobiology reviewer at Voss Neural Research (VNR).
Analyze the following tech-worker's craving statement or justification for relapse/drug use.
You MUST respond with a raw JSON object containing exactly these four keys:
- deconstruction: string (explain the cognitive structure of the craving, focusing on how the user enlists rationalizations or excuses)
- trigger: string (the physical, emotional, or environmental cue triggering the craving)
- projection: string (short-term neurochemical effects versus long-term neurotoxic and receptor downregulation consequences)
- inquiry: string (a sharp, introspective question that forces the subject to confront their rationalization)

Respond with ONLY the raw JSON object. Do NOT wrap it in markdown block quotes or anything else.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const parsedData = JSON.parse(jsonText.trim());
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error analyzing prompt:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// API Route: Multi-turn chat
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, systemInstruction } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Messages array is required" });
      return;
    }

    const ai = getGeminiClient();
    // Convert messages to Gemini format: { role, parts: [{ text }] }
    const formattedContents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.text || msg.content || "" }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction || "You are a VNR Autonomous Facilitator, an AI clinician helping high-intensity workers decouple digital-chemical loops.",
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in chat:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// API Route: Generate high-quality image
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, imageSize, aspectRatio } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || "1:1",
          imageSize: imageSize || "1K",
        },
      },
    });

    let base64Data = null;
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Data = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Data) {
      res.status(500).json({ error: "No image data was returned by the model." });
      return;
    }

    res.json({ image: `data:image/png;base64,${base64Data}` });
  } catch (error: any) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Setup Vite Dev Server / Static Asset serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
