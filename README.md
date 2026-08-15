# self-cloud-storage

A local, read-only file browser for your S3 buckets — think "Google Drive UI
for my personal S3 backups." It's a Next.js app you run on your own machine;
it is never deployed anywhere.

If the AWS CLI works on your machine, this works. There's no login screen,
no API keys to paste in, and no database — the app reads your existing AWS
credentials the exact same way the AWS CLI does, and holds no state beyond
what's in the URL.

## Features

- **Folder navigation** — S3 is flat; this simulates folders using
  `ListObjectsV2` with a delimiter, with breadcrumbs and a bookmarkable URL
  (`/?bucket=my-bucket&prefix=photos/2024/`).
- **Bucket picker** — if your credentials allow `ListBuckets`, you get a
  picker on load. If not, it falls back to a single bucket read from the
  `S3_BUCKET` environment variable.
- **Image previews** — thumbnails lazy-load as you scroll (via
  `IntersectionObserver`), fetched directly from S3 through short-lived
  presigned URLs. Bytes never pass through this server.
- **Details panel** — click any file to see its size, last-modified date,
  and storage class, plus an inline preview for images, PDFs, video, audio,
  and text/markdown.
- **Filter** — a text box filters the *current* folder's already-loaded
  listing client-side. This is not full-bucket search (that needs an index,
  which is out of scope for a tool this size).
- **Cross-region buckets** — each bucket's actual region is discovered
  automatically (via `HeadBucket`) and cached, so buckets in different
  regions than your default all work from the same bucket picker.
- **Read-only** — there is no write, delete, or upload path anywhere in the
  app.

## Setup

1. Make sure the AWS CLI already works on your machine, i.e. one of these is
   true:
   - `~/.aws/credentials` and `~/.aws/config` are set up (via `aws configure`
     or `aws configure sso`), or
   - `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` (and optionally
     `AWS_SESSION_TOKEN`) are set in your environment.

   Verify with:

   ```bash
   aws sts get-caller-identity
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. (Optional) If your AWS profile doesn't have `s3:ListAllMyBuckets`, set a
   fixed bucket to browse:

   ```bash
   export S3_BUCKET=my-backup-bucket
   ```

4. (Optional) If your AWS profile has no default region configured:

   ```bash
   export AWS_REGION=us-east-1
   ```

5. Run it:

   ```bash
   npm run dev
   ```

   Open <http://127.0.0.1:3000>. The dev server binds to `127.0.0.1` only —
   it is not reachable from other devices on your network.

## Required IAM permissions

At minimum, the AWS identity you use needs, scoped to the bucket(s) you want
to browse:

- `s3:ListBucket` — to list folders/files (`ListObjectsV2`)
- `s3:GetObject` — to generate presigned URLs for previews

Optionally, for the bucket-picker entry screen:

- `s3:ListAllMyBuckets` — to list all buckets you have access to

Optionally, for the account-info panel (user icon in the top nav):

- `sts:GetCallerIdentity` — nearly always allowed by default; shows which
  AWS identity (account ID, ARN, user/role name) this app is currently
  reading as. If denied, the panel just shows an error instead of failing
  the rest of the app.

Example minimal policy for one bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket", "s3:GetObject"],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET",
        "arn:aws:s3:::YOUR_BUCKET/*"
      ]
    }
  ]
}
```

Add `"s3:ListAllMyBuckets"` with `"Resource": "*"` as a separate statement if
you also want the bucket picker.

## Troubleshooting

- **"AWS credentials not found or expired"** — if you use AWS SSO, run
  `aws sso login` and reload the page. Otherwise, re-run
  `aws sts get-caller-identity` to confirm your credentials still work.
- **"No AWS region configured"** — add `region = ...` to your AWS profile in
  `~/.aws/config`, or set the `AWS_REGION` environment variable.
- **"No bucket configured"** — your credentials don't have
  `s3:ListAllMyBuckets`, and `S3_BUCKET` isn't set. Set `S3_BUCKET` and
  restart.

## Stack

- Next.js (App Router) + TypeScript
- `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`
- Tailwind CSS
- No database, no auth, no state beyond the URL

## License

[GPL-3.0-or-later](LICENSE).
