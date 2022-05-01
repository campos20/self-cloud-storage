import { Divider } from "antd";
import { useState } from "react";

export const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const checkFields = () => {
    // Emptyness is validated by html
    return password === checkPassword;
  };

  const handleSubmit = () => {
    if (!checkFields()) {
      return;
    }
  };

  return (
    <>
      <Divider />
      <form className="container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            required
            id="name"
            value={name}
            placeholder="Name"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            required
            id="email"
            type="email"
            value={email}
            className="form-control"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            required
            id="password"
            type="password"
            value={password}
            placeholder="Password"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            type="password"
            id="confirm-password"
            value={checkPassword}
            className="form-control"
            placeholder="Confirm password"
            onChange={(e) => setCheckPassword(e.target.value)}
          />
        </div>
        <div>
          <button className="btn btn-primary" type="button">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};
