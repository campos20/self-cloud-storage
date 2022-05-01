import { Menu } from "antd";
import { Link } from "react-router-dom";
import { LinkItem } from "../model/LinkItem";

interface TopbarProps {
  links: LinkItem[];
}

export const Topbar = ({ links }: TopbarProps) => {
  const items = links.map((l) => ({
    label: <Link to={l.path}>{l.title}</Link>,
    key: l.path,
  }));
  return (
    <header>
      <Menu
        mode="horizontal"
        defaultSelectedKeys={[links[0].path]}
        items={items}
        theme="dark"
      />
    </header>
  );
};
