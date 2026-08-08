import { GoogleGenAI } from "@google/genai";
import { getPoliticianData } from "./data/politicians";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testGemini() {
  const politician = getPoliticianData('nishant-kumar');
  if (!politician) throw new Error("Not found");
  
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `Write an objective executive summary of the following politician based ONLY on the provided structured data.
Length: 80–150 words.
DATA:
${JSON.stringify(politician, null, 2)}`;

  console.log("Generating summary for Nishant Kumar...");
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  console.log("RESULT:", response.text);
}

testGemini().catch(console.error);
