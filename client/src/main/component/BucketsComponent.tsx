import { Card } from "antd";
import { useCallback, useEffect, useState } from "react";
import { s3Api } from "../api/S3Api";
import { Bucket } from "../model/Bucket";

const gridStyle: React.CSSProperties = {
  width: "25%",
  textAlign: "center",
};

export const BucketsComponent = () => {
  const [buckets, setBuckets] = useState<Bucket[]>([]);

  const fetchBuckets = useCallback(() => {
    s3Api.listBuckets().then((response) => setBuckets(response.data));
  }, []);

  useEffect(fetchBuckets, [fetchBuckets]);

  return (
    <>
      <h2>Folders</h2>
      {buckets.length > 0 && (
        <Card>
          {buckets.map((b) => (
            <Card.Grid style={gridStyle} hoverable>
              {b.name}
            </Card.Grid>
          ))}
        </Card>
      )}
    </>
  );
};
