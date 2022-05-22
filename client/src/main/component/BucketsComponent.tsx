import { Col, Row } from "antd";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { s3Api } from "../api/S3Api";
import { Bucket } from "../model/Bucket";
import style from "./BucketsComponent.module.css";

export const BucketsComponent = () => {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [screenWidth, setWidth] = useState(window.innerWidth);
  const [selected, setSelected] = useState<number>();

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

  return (
    <>
      <h2>Folders</h2>
      <Row gutter={[8, 8]}>
        {buckets.length > 0 &&
          buckets.map((bucket, i) => (
            <Col key={bucket.name} span={4} onClick={() => setSelected(i)}>
              <div
                className={
                  style.bucket +
                  (i === selected ? ` ${style.selectedBucket}` : "")
                }
              >
                {bucket.name}
              </div>
            </Col>
          ))}
      </Row>
    </>
  );
};
