import { NextResponse } from "next/server";
import { getCallerIdentity } from "@/lib/sts";
import { errorMessage, isCredentialsError } from "@/lib/errors";

export async function GET() {
  try {
    const identity = await getCallerIdentity();
    return NextResponse.json({ ...identity, region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || null });
  } catch (err) {
    console.error("Failed to get caller identity:", err);
    return NextResponse.json(
      { error: errorMessage(err), credentialsError: isCredentialsError(err) },
      { status: 502 }
    );
  }
}
