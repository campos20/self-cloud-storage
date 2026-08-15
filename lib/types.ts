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
