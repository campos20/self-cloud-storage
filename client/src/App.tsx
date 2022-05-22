import { useCallback, useEffect, useState } from "react";
import { s3Api } from "./main/api/S3Api";
import { Bucket } from "./main/model/Bucket";

export const App = () => {
  const [buckets, setBuckets] = useState<Bucket[]>([]);

  const fetchBuckets = useCallback(() => {
    s3Api.listBuckets().then((response) => setBuckets(response.data));
  }, []);

  useEffect(fetchBuckets, [fetchBuckets]);

  return (
    <div className="App">
      <div>
        <h1>Self Cloud Storage</h1>
        <div>You have {buckets.length} buckets</div>
      </div>
    </div>
  );
};
