import { FolderOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useCallback, useEffect, useState } from "react";
import { s3Api } from "../api/S3Api";
import { Bucket } from "../model/Bucket";
import style from "./BucketsComponent.module.css";
import { getStep } from "./BucketsComponentUtil";

export const BucketsComponent = () => {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [selected, setSelected] = useState<number>();

  const fetchBuckets = useCallback(() => {
    s3Api.listBuckets().then((response) => setBuckets(response.data));
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const step = getStep();
      if (e.key === "ArrowRight") {
        setSelected((o) =>
          o == null ? 0 : Math.min(o + 1, buckets.length - 1)
        );
      } else if (e.key === "ArrowLeft") {
        setSelected((o) => (o == null ? 0 : Math.max(o - 1, 0)));
      } else if (e.key === "ArrowDown") {
        setSelected((o) =>
          o == null ? 0 : Math.min(o + step, buckets.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        setSelected((o) => (o == null ? 0 : Math.max(o - step, 0)));
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [buckets]);

  useEffect(fetchBuckets, [fetchBuckets]);

  return (
    <div>
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
              <Row
                className={
                  style.bucket +
                  (i === selected ? ` ${style.selectedBucket}` : "")
                }
              >
                <Col span={2}>
                  <FolderOutlined />
                </Col>
                <Col span={22}>{bucket.name}</Col>
              </Row>
            </Col>
          ))}
      </Row>
    </div>
  );
};
