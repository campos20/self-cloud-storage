import { S3Client, type S3ClientConfig } from "@aws-sdk/client-s3";
import { STSClient, type STSClientConfig } from "@aws-sdk/client-sts";

const s3Clients = new Map<string, S3Client>();
let stsClient: STSClient | undefined;

// No explicit credentials: the SDK's default provider chain resolves env
// vars, ~/.aws/credentials, and SSO the same way the AWS CLI does.
//
// `region` overrides the default/env-resolved region for buckets that live
// elsewhere — S3 requires the client to be addressed at the bucket's actual
// region, see lib/s3.ts's resolveBucketRegion.
export function getS3Client(region?: string): S3Client {
  const cacheKey = region ?? "__default__";
  let client = s3Clients.get(cacheKey);
  if (!client) {
    const config: S3ClientConfig = {};
    const resolvedRegion = region ?? process.env.AWS_REGION;
    if (resolvedRegion) {
      config.region = resolvedRegion;
    }
    client = new S3Client(config);
    s3Clients.set(cacheKey, client);
  }
  return client;
}

// GetCallerIdentity is region-agnostic (an STS global endpoint), but the
// client still needs some region configured to sign requests.
export function getStsClient(): STSClient {
  if (!stsClient) {
    const config: STSClientConfig = {};
    if (process.env.AWS_REGION) {
      config.region = process.env.AWS_REGION;
    }
    stsClient = new STSClient(config);
  }
  return stsClient;
}
