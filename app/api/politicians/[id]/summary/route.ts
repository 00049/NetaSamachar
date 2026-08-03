import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { inngest } from "../../../../../inngest/client";
import { getPoliticianData } from "../../../../../data/politicians";
import crypto from "crypto";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Get structured data
  const politician = getPoliticianData(id);
  if (!politician) {
    return NextResponse.json({ error: "Politician not found" }, { status: 404 });
  }

  // 2. Generate inputHash
  const inputHash = crypto.createHash("md5").update(JSON.stringify(politician)).digest("hex");

  // 3. Check existing summary
  const existingSummary = await prisma.aISummary.findUnique({
    where: { politicianId: id },
  });

  // 4. If up-to-date, just return it
  if (existingSummary && existingSummary.inputHash === inputHash && existingSummary.status !== "FAILED") {
    return NextResponse.json(existingSummary);
  }

  // 5. Data has changed or no summary exists. We must regenerate.
  // Prevent firing multiple jobs if already generating the same hash.
  if (existingSummary && existingSummary.status === "GENERATING" && existingSummary.inputHash === inputHash) {
    return NextResponse.json(existingSummary);
  }

  // Update DB to mark as GENERATING, preserving old summary text so frontend can still display it.
  const updatedSummary = await prisma.aISummary.upsert({
    where: { politicianId: id },
    update: {
      status: "GENERATING",
      inputHash, // update hash so we know what we are generating for
    },
    create: {
      politicianId: id,
      summary: "", // no old summary exists
      status: "GENERATING",
      inputHash,
      lastDataUpdate: new Date(),
      sourcesUsed: "[]",
      confidenceScore: 0,
    },
  });

  // 6. Fire Inngest job
  await inngest.send({
    name: "ai.summary.requested",
    data: {
      politicianId: id,
      inputHash,
    },
  });

  // 7. Return the stale/generating summary immediately (Zero wait time for AI)
  return NextResponse.json(updatedSummary);
}
