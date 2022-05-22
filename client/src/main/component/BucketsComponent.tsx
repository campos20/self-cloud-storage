import { Col, Row } from "antd";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { s3Api } from "../api/S3Api";
import { Bucket } from "../model/Bucket";
import style from "./BucketsComponent.module.css";

export const BucketsComponent = () => {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [selected, setSelected] = useState<number>();

  const fetchBuckets = useCallback(() => {
    s3Api.listBuckets().then((response) => setBuckets(response.data));
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setSelected((o) =>
          o == null ? 0 : Math.min(o + 1, buckets.length - 1)
        );
      } else if (e.key === "ArrowLeft") {
        setSelected((o) => (o == null ? 0 : Math.max(o - 1, 0)));
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [buckets]);

  useEffect(fetchBuckets, [fetchBuckets]);

  return (
    <>
      <h2>Folders</h2>
      <Row gutter={[8, 8]}>
        {buckets.length > 0 &&
          buckets.map((bucket, i) => (
            <Col
              key={bucket.name}
              onClick={() => setSelected(i)}
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 6 }}
            >
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
