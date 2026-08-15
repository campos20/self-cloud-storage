import { GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { getStsClient } from "./aws";

export interface CallerIdentity {
  account: string;
  arn: string;
  userId: string;
}

// The read-only "who am I" check — same info `aws sts get-caller-identity`
// returns. Used to show which AWS identity this app is currently reading as.
export async function getCallerIdentity(): Promise<CallerIdentity> {
  const client = getStsClient();
  const res = await client.send(new GetCallerIdentityCommand({}));
  return {
    account: res.Account ?? "unknown",
    arn: res.Arn ?? "unknown",
    userId: res.UserId ?? "unknown",
  };
}
