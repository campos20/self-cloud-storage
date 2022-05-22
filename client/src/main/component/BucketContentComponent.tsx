import { useParams } from "react-router-dom";

export const BucketContentComponent = () => {
  let { bucketName } = useParams();

  return <div>{bucketName}</div>;
};
