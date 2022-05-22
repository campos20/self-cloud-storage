import { Card } from "antd";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { s3Api } from "../api/S3Api";
import { Bucket } from "../model/Bucket";

export const BucketsComponent = () => {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [screenWidth, setWidth] = useState(window.innerHeight);

  const fetchBuckets = useCallback(() => {
    s3Api.listBuckets().then((response) => setBuckets(response.data));
  }, []);

  useEffect(fetchBuckets, [fetchBuckets]);

  useEffect(() => {
    const debouncedHandleResize = debounce(() => {
      setWidth(window.innerWidth);
    }, 500);

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, []);

  const getWidth = () => {
    if (screenWidth > 992) {
      return 4;
    }
    if (screenWidth > 576) {
      return 2;
    }
    return 1;
  };

  const width = getWidth();

  return (
    <>
      <h2>Folders</h2>
      {buckets.length > 0 && (
        <Card>
          {buckets.map((b) => (
            <Card.Grid
              key={b.name}
              style={{ textAlign: "center", width: `${100 / width}%` }}
              hoverable
            >
              {b.name}
            </Card.Grid>
          ))}
        </Card>
      )}
    </>
  );
};
