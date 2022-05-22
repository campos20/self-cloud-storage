import { Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { s3Api } from "./main/api/S3Api";
import { Bucket } from "./main/model/Bucket";

const columns = [
  {
    title: "BUCKET",
    dataIndex: "name",
  },
  {
    title: "OWNER",
    dataIndex: ["owner", "displayName"],
  },
  {
    title: "CREATION",
    dataIndex: "creationDate",
  },
];

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
        {buckets.length > 0 && <Table columns={columns} dataSource={buckets} />}
      </div>
    </div>
  );
};
