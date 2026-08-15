import { S3Client, type S3ClientConfig } from "@aws-sdk/client-s3";

const clients = new Map<string, S3Client>();

// No explicit credentials: the SDK's default provider chain resolves env
// vars, ~/.aws/credentials, and SSO the same way the AWS CLI does.
//
// `region` overrides the default/env-resolved region for buckets that live
// elsewhere — S3 requires the client to be addressed at the bucket's actual
// region, see lib/s3.ts's resolveBucketRegion.
export function getS3Client(region?: string): S3Client {
  const cacheKey = region ?? "__default__";
  let client = clients.get(cacheKey);
  if (!client) {
    const config: S3ClientConfig = {};
    const resolvedRegion = region ?? process.env.AWS_REGION;
    if (resolvedRegion) {
      config.region = resolvedRegion;
    }
    client = new S3Client(config);
    clients.set(cacheKey, client);
  }
  return client;
}
