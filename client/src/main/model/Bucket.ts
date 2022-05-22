interface Owner {
  displayName: string;
  id: string;
}

export interface Bucket {
  name: string;
  owner: Owner;
  creationDate: Date;
}
