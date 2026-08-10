import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { inngest } from "../../../../../inngest/client";
import { getPoliticianData } from "../../../../../data/politicians";
import crypto from "crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 5 requests per 1 minute
// Note: Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
});
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Rate Limiting (5 requests per minute per IP per politician ID)
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const identifier = `ratelimit_${ip}_${id}`;
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  // 1. Get structured data
  const politician = getPoliticianData(id);
  if (!politician) {
    return NextResponse.json({ error: "Politician not found" }, { status: 404 });
  }

  // 2. Generate inputHash
  const inputHash = crypto.createHash("sha256").update(JSON.stringify(politician)).digest("hex");

  // 3. Check existing summary
  const existingSummary = await prisma.aISummary.findUnique({
    where: { politicianId: id },
  });

  // 4. If up-to-date, just return it
  if (existingSummary && existingSummary.inputHash === inputHash && existingSummary.status !== "FAILED") {
    return NextResponse.json(existingSummary);
  }

  // 5. Data has changed or no summary exists. We must regenerate.
  // Prevent firing multiple jobs if already generating the same hash, unless it's been stuck for over 5 minutes.
  if (existingSummary && existingSummary.status === "GENERATING" && existingSummary.inputHash === inputHash) {
    const timeSinceGenerated = Date.now() - new Date(existingSummary.lastDataUpdate).getTime();
    if (timeSinceGenerated < 5 * 60 * 1000) {
      return NextResponse.json(existingSummary);
    }
    // If it's been more than 5 minutes, we assume the previous job failed or crashed, so we proceed to regenerate.
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
