import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

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

// 1. Text completion and analysis endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history = [], systemInstruction, model = "gemini-3.5-flash" } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const ai = getGeminiClient();

    // Map client model aliases to full correct names
    let modelName = "gemini-3.5-flash";
    if (model === "gemini-3.1-pro-preview") {
      modelName = "gemini-3.1-pro-preview";
    } else if (model === "gemini-3.1-flash-lite") {
      modelName = "gemini-3.1-flash-lite";
    }

    // Prepare contents with optional history
    const contents = [];
    for (const turn of history) {
      contents.push({
        role: turn.role,
        parts: [{ text: turn.text }],
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ error: error.message || "Internal server error calling Gemini API" });
  }
});

// 2. Voss Mirror analyzer: Special endpoint that parses input and strictly rewrites it
// into clinical, third-person dry language with mechanistic decomposition.
app.post("/api/gemini/voss-mirror", async (req, res) => {
  try {
    const { statement } = req.body;
    if (!statement) {
      res.status(400).json({ error: "Statement is required" });
      return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a strict, non-judgmental analytical mirror implementing the Voss Protocols.
Your task is to take any user statement, craving justification, or sycophantic expression, and rewrite it strictly according to these constraints:
1. Use an absolute dry, clinical, third-person tone.
2. Absolutely prohibit first-person pronouns ("I", "me", "my", "we").
3. Ban emotional validation, sympathy, encouragement, or sycophantic praise. Do not say "I understand" or "It's okay" or "You are doing great."
4. Decompose the assertion into direct underlying mechanical components:
   - Chemical/Neurochemical pathways (e.g., dopamine surge, VMAT2 interaction, receptor downregulation, predictive-error firing).
   - Behavioral reinforcements (e.g., habit loop, cue reactivity, distress escape, conditioning).
   - Narrative structures (e.g., cognitive distortion, craving rationalization).
5. Output the result in a clean, structured JSON format with three fields:
   - "rewrittenText": The strict, third-person analytical mirror translation of the statement.
   - "neurochemicalDecomposition": Detail the specific neurochemical mechanisms active behind this state (e.g., "dopaminergic terminal craving", "sensitized wanting vs hedonic liking").
   - "behavioralDecomposition": Detail the habit loop mechanisms and cue reinforcement.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Deconstruct this statement: "${statement}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rewrittenText: {
              type: Type.STRING,
              description: "The statement translated into absolute third-person dry clinical observation.",
            },
            neurochemicalDecomposition: {
              type: Type.STRING,
              description: "Detailed analysis of the neurotransmitter dynamics and receptor states behind the cue.",
            },
            behavioralDecomposition: {
              type: Type.STRING,
              description: "Detailed breakdown of the operational conditioning and reinforcement schedules.",
            },
          },
          required: ["rewrittenText", "neurochemicalDecomposition", "behavioralDecomposition"],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Voss Mirror API Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// 3. Image generation endpoint using gemini-3-pro-image-preview
app.post("/api/gemini/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio = "1:1", imageSize = "1K" } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const ai = getGeminiClient();

    // Use gemini-3-pro-image-preview as requested by metadata
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio,
          imageSize,
        },
      },
    });

    let base64Image = "";
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Image) {
      res.status(500).json({ error: "No image data was returned by the model." });
      return;
    }

    res.json({ imageUrl: `data:image/png;base64,${base64Image}` });
  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate image" });
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
