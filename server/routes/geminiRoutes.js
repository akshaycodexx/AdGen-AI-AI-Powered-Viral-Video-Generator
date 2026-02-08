import express from 'express';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import Script from '../models/Script.js';

import User from '../models/User.js';

dotenv.config();

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/generate', async (req, res) => {
  try {
    const { productName, description, targetAudience, tone, userId, customPrompt } = req.body;

    // Check Credits
    if (userId) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (user.credits < 1) {
        return res.status(403).json({ message: 'Insufficient credits. Please upgrade.' });
      }
    }

    let task;
    if (customPrompt) {
      task = `
            Create a viral TikTok-style short video ad script based on this specific request: "${customPrompt}".
            
            Integrate current viral trends, popular audio styles, and high-energy paving.
        `;
    } else {
      task = `
            Create a compelling short video ad script for the following product:
            Product Name: ${productName}
            Description: ${description}
            Target Audience: ${targetAudience}
            Tone: ${tone}
            
            Integrate current viral trends (challenges, memes, popular audio styles) relevant to ${new Date().getFullYear()}.
        `;
    }

    task += `
      Return the result as a VALID JSON Object (no markdown formatting, just the raw JSON) with the following schema:
      {
        "hook": "string (0-3s hook, very catchy)",
        "scenes": [
          {
            "visual": "string (detailed visual description for AI image generation - include style keywords like '4k', 'cinematic', 'neon')",
            "audio": "string (voiceover text or sound effect description)",
            "seconds": number
          }
        ],
        "cta": "string (strong call to action)",
        "hashtags": ["string", "string", "string"]
      }

      Make it viral-worthy! Ensure the "visual" descriptions are vivid and detailed enough to be used as prompts for an image generator. 
      Format for 9:16 vertical video (TikTok/Reels/Shorts).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: 'user', parts: [{ text: task }] }],
    });

    let text = response.text;

    // Clean up markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const scriptData = JSON.parse(text);

    // Save user script and deduct credit
    if (userId) {
      const newScript = new Script({
        user: userId,
        productName: productName || 'Custom Video',
        description: description || customPrompt,
        targetAudience: targetAudience || 'General',
        tone: tone || 'Creative',
        generatedScript: JSON.stringify(scriptData)
      });
      await newScript.save();

      // Deduct Credit
      await User.findByIdAndUpdate(userId, { $inc: { credits: -1 } });
    }

    res.json({ script: scriptData });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ message: 'Failed to generate script', error: error.message });
  }
});

export default router;
