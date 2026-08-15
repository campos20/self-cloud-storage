import { NextRequest, NextResponse } from "next/server";
import { getPresignedGetUrl } from "@/lib/s3";
import { errorMessage } from "@/lib/errors";

// Read-only: signs a short-lived GET URL and redirects. Bytes are streamed
// from S3 straight to the browser — never proxied through this server.
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
    const url = await getPresignedGetUrl(bucket, key);
    return NextResponse.redirect(url, 302);
  } catch (err) {
    console.error(`Failed to presign ${bucket}/${key}:`, err);
    return NextResponse.json(
      { error: errorMessage(err) },
      { status: 502 }
    );
  }
}
