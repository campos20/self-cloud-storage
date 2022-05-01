import { Divider } from "antd";
import { Link } from "react-router-dom";

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
          {/* TODO this does not update highlight in the topbar */}
          <Link to="register" className="btn btn-primary btn-lg">
            Register
          </Link>
        </div>
      </div>
    </>
  );
};
