import axios from "axios";
import { UserCreate } from "../model/UserCreate";

const BASE_URL = process.env.REACT_APP_USER_BASE_URL! + "user/";

class UserApi {
  createUser = (user_create: UserCreate) => {
    return axios.post<void>(BASE_URL, user_create);
  };
}

export const userApi = new UserApi();
