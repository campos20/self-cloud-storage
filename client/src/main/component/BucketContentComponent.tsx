import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { s3Api } from "../api/S3Api";
import { BucketObject } from "../model/Bucket";

export const BucketContentComponent = () => {
  const [content, setContent] = useState<BucketObject[]>([]);
  const [bucketName, _setBucketName] = useState<string>(
    useParams().bucketName!
  );

  const fetchContent = useCallback((name: string) => {
    s3Api.listObjects(name).then((response) => setContent(response.data));
  }, []);

  useEffect(() => fetchContent(bucketName), [fetchContent, bucketName]);

  return (
    <div>
      {bucketName}
      {JSON.stringify(content)}
    </div>
  );
};
