import { Col, Row } from "antd";
import { chunk, debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { s3Api } from "../api/S3Api";
import { Bucket } from "../model/Bucket";

import style from "./BucketsComponent.module.css";

export const BucketsComponent = () => {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [screenWidth, setWidth] = useState(window.innerWidth);

  const fetchBuckets = useCallback(() => {
    s3Api.listBuckets().then((response) => setBuckets(response.data));
  }, []);

  useEffect(fetchBuckets, [fetchBuckets]);

  useEffect(() => {
    const debouncedHandleResize = debounce(() => {
      setWidth(window.innerWidth);
    }, 1);

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, []);

  const getColumns = () => {
    if (screenWidth > 992) {
      return 6;
    }
    if (screenWidth > 576) {
      return 4;
    }
    return 2;
  };

  const columns = getColumns();

  const chunks = chunk(buckets, columns);

  return (
    <>
      <h2>Folders</h2>
      {buckets.length > 0 &&
        chunks.map((c) => (
          <Row gutter={[16, 16]}>
            {c.map((bucket) => (
              <Col className={style.bucket} span={24 / columns}>
                {bucket.name}
              </Col>
            ))}
          </Row>
        ))}
    </>
  );
};
