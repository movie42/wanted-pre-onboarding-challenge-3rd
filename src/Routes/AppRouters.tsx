import React from "react";
import About from "../Pages/about";
import Main from "../Pages/main";
import Route from "./Route";
import Router from "./Router";

interface IAppRoutersProps {}

const AppRouters = () => {
  return (
    <Router>
      <>
        <Route path="/" component={<Main />} />
        <Route path="/about" component={<About />} />
      </>
    </Router>
  );
};

export default AppRouters;
