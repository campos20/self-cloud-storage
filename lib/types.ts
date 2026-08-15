export interface BucketEntry {
  name: string;
  creationDate: string | null;
}

export interface FileEntry {
  key: string;
  size: number;
  lastModified: string | null;
  storageClass: string | null;
}

export type BrowserTarget =
  | { type: "file"; file: FileEntry; name: string }
  | { type: "folder"; fullPrefix: string; name: string };
