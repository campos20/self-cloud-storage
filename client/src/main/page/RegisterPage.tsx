import { Divider } from "antd";
import { useState } from "react";

export const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
      <Divider />
      <div className="container">
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="check-password">Confirm password</label>
          <input
            type="password"
            className="form-control"
            id="check-password"
            placeholder="Confirm password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input className="form-control" id="name" placeholder="Name" />
        </div>
      </div>
    </>
  );
};
