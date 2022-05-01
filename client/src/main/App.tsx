import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Topbar } from "./component/Topbar";
import { LinkItem } from "./model/LinkItem";
import { HomePage } from "./page/HomePage";
import { RegisterPage } from "./page/RegisterPage";

export const App = () => {
  const links: LinkItem[] = [
    { path: "/", title: "Home", element: <HomePage /> },
    { path: "register", title: "Register", element: <RegisterPage /> },
  ];

  return (
    <div>
      <BrowserRouter>
        <Topbar links={links} />
        <Routes>
          {links.map((l) => (
            <Route key={l.path} path={l.path} element={l.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
};
