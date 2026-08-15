import {
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "./aws";
import { isAccessDeniedError } from "./errors";
import type { BucketEntry, FileEntry } from "./types";

// Returns null (rather than throwing) when ListBuckets is denied, so the
// caller can fall back to an env-configured bucket instead of erroring out.
export async function listBuckets(): Promise<BucketEntry[] | null> {
  const client = getS3Client();
  try {
    const res = await client.send(new ListBucketsCommand({}));
    return (res.Buckets ?? [])
      .filter((b) => b.Name)
      .map((b) => ({
        name: b.Name!,
        creationDate: b.CreationDate ? b.CreationDate.toISOString() : null,
      }));
  } catch (err) {
    if (isAccessDeniedError(err)) return null;
    throw err;
  }
}

export async function listObjects(
  bucket: string,
  prefix: string
): Promise<{ folders: string[]; files: FileEntry[] }> {
  const client = getS3Client();
  const folders = new Set<string>();
  const files: FileEntry[] = [];
  let continuationToken: string | undefined;

  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        Delimiter: "/",
        ContinuationToken: continuationToken,
      })
    );

    for (const cp of res.CommonPrefixes ?? []) {
      if (cp.Prefix) folders.add(cp.Prefix);
    }
    for (const obj of res.Contents ?? []) {
      // Skip the zero-byte "folder marker" object S3 sometimes returns for
      // the prefix itself.
      if (!obj.Key || obj.Key === prefix) continue;
      files.push({
        key: obj.Key,
        size: obj.Size ?? 0,
        lastModified: obj.LastModified ? obj.LastModified.toISOString() : null,
        storageClass: obj.StorageClass ?? null,
      });
    }

    continuationToken = res.NextContinuationToken;
  } while (continuationToken);

  return { folders: Array.from(folders).sort(), files };
}

export async function getPresignedGetUrl(
  bucket: string,
  key: string,
  expiresInSeconds = 300
): Promise<string> {
  const client = getS3Client();
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}
