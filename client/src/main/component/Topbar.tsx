import { UserOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LinkItem } from "../model/LinkItem";
import "./Topbar.css";

interface TopbarProps {
  links: LinkItem[];
}

export const Topbar = ({ links }: TopbarProps) => {
  const [current, setCurrent] = useState(
    (links.find((it) => it.path === window.location.pathname) || links[0]).path
  );

  const items = [
    ...links.map((l) => ({
      label: <Link to={l.path}>{l.title}</Link>,
      key: l.path,
      icon: l.icon,
    })),
    { label: "Login", key: "login", id: "login", icon: <UserOutlined /> },
  ];

  return (
    <Menu
      onClick={(e) => setCurrent(e.key)}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
      theme="dark"
    />
  );
};
