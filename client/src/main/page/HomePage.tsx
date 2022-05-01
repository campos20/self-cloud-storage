import { Divider } from "antd";

export const HomePage = () => {
  return (
    <>
      <Divider />
      <div className="jumbotron jumbotron text-center">
        <h1 className="display-4">Cloud Storage</h1>
        <p className="lead">Cheap and reliable cloud storage</p>
        <p>Store, protect, and retrieve your contents in the cloud</p>
        <div className="lead">
          <button className="btn btn-primary btn-lg">Login</button>
          <button className="btn btn-primary btn-lg">Register</button>
        </div>
      </div>
    </>
  );
};
