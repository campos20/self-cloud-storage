import { Menu } from "antd";

export const Topbar = () => {
  return (
    <Menu mode="horizontal" defaultSelectedKeys={["mail"]}>
      <Menu.Item key="home">Home</Menu.Item>
      <Menu.Item key="product">Product</Menu.Item>
    </Menu>
  );
};
