import { listBuckets, listObjects } from "@/lib/s3";
import BucketPicker from "@/components/BucketPicker";
import Breadcrumbs from "@/components/Breadcrumbs";
import ObjectBrowser from "@/components/ObjectBrowser";
import ErrorPanel from "@/components/ErrorPanel";
import SetupNeeded from "@/components/SetupNeeded";
import type { BucketEntry, FileEntry } from "@/lib/types";

type ViewState =
  | { kind: "buckets"; buckets: BucketEntry[] }
  | { kind: "browse"; bucket: string; prefix: string; folders: string[]; files: FileEntry[] }
  | { kind: "setup-needed" }
  | { kind: "error"; error: unknown };

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const bucketParam = typeof sp.bucket === "string" ? sp.bucket : undefined;
  const prefix = typeof sp.prefix === "string" ? sp.prefix : "";

  const state = await loadViewState(bucketParam, prefix);

  switch (state.kind) {
    case "buckets":
      return <BucketPicker buckets={state.buckets} />;
    case "setup-needed":
      return (
        <main className="flex-1 px-6 py-8">
          <SetupNeeded />
        </main>
      );
    case "error":
      return (
        <main className="flex-1 px-6 py-8">
          <ErrorPanel error={state.error} />
        </main>
      );
    case "browse":
      return (
        <main className="flex-1 px-6 py-8">
          <div className="mb-6">
            <Breadcrumbs bucket={state.bucket} prefix={state.prefix} />
          </div>
          <ObjectBrowser
            bucket={state.bucket}
            prefix={state.prefix}
            folders={state.folders}
            files={state.files}
          />
        </main>
      );
  }
}

// Entry screen: prefer the bucket picker when IAM allows ListBuckets,
// falling back to a fixed env-configured bucket when it's denied.
async function loadViewState(
  bucketParam: string | undefined,
  prefix: string
): Promise<ViewState> {
  let bucket = bucketParam;

  if (!bucket) {
    try {
      const buckets = await listBuckets();
      if (buckets) return { kind: "buckets", buckets };
    } catch (err) {
      return { kind: "error", error: err };
    }
    bucket = process.env.S3_BUCKET;
    if (!bucket) return { kind: "setup-needed" };
  }

  try {
    const { folders, files } = await listObjects(bucket, prefix);
    return { kind: "browse", bucket, prefix, folders, files };
  } catch (err) {
    return { kind: "error", error: err };
  }
}
