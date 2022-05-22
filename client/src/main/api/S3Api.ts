import axios from "axios";
import { Bucket, BucketObject } from "../model/Bucket";

const BASE_URL = process.env.REACT_APP_USER_BASE_URL! + "s3/";

class S3Api {
  listBuckets = () => {
    return axios.get<Bucket[]>(BASE_URL);
  };

  listObjects = (bucketName: string) => {
    return axios.get<BucketObject[]>(BASE_URL + bucketName);
  };
}

export const s3Api = new S3Api();
