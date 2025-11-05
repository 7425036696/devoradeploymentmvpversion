import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { getUsageStatus } from "@/lib/usage";

export async function GET(req) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await getUsageStatus(); // ✅ This already fetches usage
    if (!result) {
      // No record yet
      return NextResponse.json({
        points: 0,
        remainingPoints: 5, // Your plan limit
        msBeforeNext: 0,
      });
    }

    const remainingPoints = Math.max(result.remainingPoints ?? 0, 0);

    return NextResponse.json({
      points: result.consumedPoints ?? 0,
      remainingPoints,
      msBeforeNext: result.msBeforeNext ?? 0,
    });
  } catch (err) {
    console.error("Error fetching usage:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
