interface Owner {
  displayName: string;
  id: string;
}

export interface Bucket {
  name: string;
  owner: Owner;
  creationDate: Date;
}

export interface BucketObject {
  bucketName: string;
  key: string;
  size: number;
  lastModified: Date;
  storageClass: string;
  owner: Owner;
  etag: string;
}
