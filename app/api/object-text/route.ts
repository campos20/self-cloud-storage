import { NextRequest, NextResponse } from "next/server";
import { getObjectTextPreview } from "@/lib/s3";
import { errorMessage } from "@/lib/errors";

// Unlike /api/object, this reads bytes server-side instead of redirecting:
// the browser's fetch() for a text preview is a CORS-checked request, and
// personal buckets rarely allow this app's origin. The read is capped, so
// this never proxies more than a small preview's worth of bytes.
export async function GET(request: NextRequest) {
  const bucket = request.nextUrl.searchParams.get("bucket");
  const key = request.nextUrl.searchParams.get("key");

  if (!bucket || !key) {
    return NextResponse.json(
      { error: "Missing required 'bucket' or 'key' query parameter" },
      { status: 400 }
    );
  }

  try {
    const text = await getObjectTextPreview(bucket, key);
    return new NextResponse(text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error(`Failed to read preview for ${bucket}/${key}:`, err);
    return NextResponse.json(
      { error: errorMessage(err) },
      { status: 502 }
    );
  }
}
