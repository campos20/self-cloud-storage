import { Menu } from "antd";
import { Link } from "react-router-dom";
import { LinkItem } from "../model/LinkItem";

interface TopbarProps {
  links: LinkItem[];
}

export const Topbar = ({ links }: TopbarProps) => {
  return (
    <header>
      <Menu mode="horizontal" defaultSelectedKeys={[links[0].path]}>
        {links.map((l) => (
          <Menu.Item key={l.path}>
            <Link to={l.path}>{l.title}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </header>
  );
};
