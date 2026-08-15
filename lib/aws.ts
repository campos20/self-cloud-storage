import { S3Client, type S3ClientConfig } from "@aws-sdk/client-s3";

let client: S3Client | undefined;

// No explicit credentials: the SDK's default provider chain resolves env
// vars, ~/.aws/credentials, and SSO the same way the AWS CLI does.
export function getS3Client(): S3Client {
  if (!client) {
    const config: S3ClientConfig = {};
    if (process.env.AWS_REGION) {
      config.region = process.env.AWS_REGION;
    }
    client = new S3Client(config);
  }
  return client;
}
