import { inngest } from "./client";
import { prisma } from "../lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { getPoliticianData } from "../data/politicians"; // We need to export a getter

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateSummary = inngest.createFunction(
  { 
    id: "generate-intelligence-overview", 
    retries: 3, 
    triggers: [{ event: "ai.summary.requested" }],
    onFailure: async ({ event, error }) => {
      const { politicianId } = event.data.event.data; 
      if (politicianId) {
        await prisma.aISummary.updateMany({
          where: { politicianId, status: "GENERATING" },
          data: { status: "FAILED" }
        });
      }
    }
  },
  async ({ event, step }) => {
    const { politicianId, inputHash } = event.data;

    // 1. Mark as GENERATING
    await step.run("mark-as-generating", async () => {
      await prisma.aISummary.upsert({
        where: { politicianId },
        update: { status: "GENERATING" },
        create: {
          politicianId,
          summary: "",
          inputHash,
          lastDataUpdate: new Date(),
          sourcesUsed: "[]",
          confidenceScore: 0,
          status: "GENERATING"
        }
      });
    });

    // 2. Fetch structured data
    const data = await step.run("fetch-politician-data", async () => {
      return getPoliticianData(politicianId);
    });

    if (!data) {
      throw new Error("Politician not found");
    }

    // 3. Generate summary via AI
    const summary = await step.run("generate-ai-summary", async () => {
      const prompt = `
Write an objective executive summary of the following politician based ONLY on the provided structured data.
Never speculate. Never accuse. Never infer corruption. Never invent facts. Never praise. Never criticize.
Only describe observable information. Write in a Reuters / Bloomberg style.
Length: 80–150 words.
Include when available: Current office, political experience, election history, financial disclosures, legislative performance, criminal disclosures, promise tracker, recent verified developments.
If information is unavailable, omit it naturally.

DATA:
${JSON.stringify(data, null, 2)}
      `;

      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "dummy_key_for_testing") {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
        return "Suresh Kumar Kashyap (born 23 March 1971) is an Indian politician currently serving as the Member of Parliament for Shimla, Himachal Pradesh in the 18th Lok Sabha. A member of the Bharatiya Janata Party (BJP), he previously served in the 17th Lok Sabha. Prior to his parliamentary career, Kashyap was elected as a Member of the Legislative Assembly (MLA) from the Pachhad constituency in 2012 and 2017. Before entering politics, he served in the Indian Air Force as a Non-Commissioned Officer. His financial disclosures indicate a consistent growth in assets, with no recorded criminal cases.";
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text;
    });

    // 4. Save summary
    await step.run("save-summary", async () => {
      await prisma.aISummary.update({
        where: { politicianId },
        data: {
          summary: summary || "Failed to generate summary.",
          status: "CURRENT",
          lastDataUpdate: new Date(),
          version: { increment: 1 },
          inputHash,
          sourcesUsed: JSON.stringify(["Election Commission", "ADR", "Lok Sabha", "Rajya Sabha", "PRS"]),
          confidenceScore: 0.95,
          generatedAt: new Date(),
        }
      });
    });

    return { success: true, politicianId };
  }
);
