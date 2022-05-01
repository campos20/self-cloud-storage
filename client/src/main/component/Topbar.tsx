import { Menu } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LinkItem } from "../model/LinkItem";

interface TopbarProps {
  links: LinkItem[];
}

export const Topbar = ({ links }: TopbarProps) => {
  const [current, setCurrent] = useState(
    (links.find((it) => it.path === window.location.pathname) || links[0]).path
  );

  const items = links.map((l) => ({
    label: <Link to={l.path}>{l.title}</Link>,
    key: l.path,
  }));

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
