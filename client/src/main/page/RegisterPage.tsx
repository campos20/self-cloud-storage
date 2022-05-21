import { Divider, message } from "antd";
import React, { useState } from "react";
import { userApi } from "../api/UserApi";
import { UserCreate } from "../model/UserCreate";

export const RegisterPage = () => {
  const [userCreate, setUserCreate] = useState<UserCreate>({
    first_name: "",
    last_name: "",
    password: "",
    email: "",
  });

  const [checkPassword, setCheckPassword] = useState("");

  const checkFields = () => {
    // Emptyness is validated by html
    return userCreate.password === checkPassword;
  };

  const handleSubmit = () => {
    if (!checkFields()) {
      return;
    }
    console.log(userCreate);

    userApi
      .createUser(userCreate)
      .then((response) => console.log(response))
      .catch((e) => message.error(e));
  };

  const changeField = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setUserCreate((old) => ({ ...old, [field]: e.target.value }));
  };

  return (
    <>
      <Divider />
      <form className="container">
        <div className="form-group">
          <label htmlFor="first_name">Name</label>
          <input
            required
            id="first_name"
            value={userCreate.first_name}
            placeholder="First name"
            className="form-control"
            onChange={(e) => changeField(e, "first_name")}
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            required
            id="last_name"
            value={userCreate.last_name}
            placeholder="Name"
            className="form-control"
            onChange={(e) => changeField(e, "last_name")}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            required
            id="email"
            type="email"
            value={userCreate.email}
            className="form-control"
            placeholder="Enter email"
            onChange={(e) => changeField(e, "email")}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            required
            id="password"
            type="password"
            value={userCreate.password}
            placeholder="Password"
            className="form-control"
            onChange={(e) => changeField(e, "password")}
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
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};
