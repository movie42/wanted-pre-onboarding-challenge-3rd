import React from "react";
import Route from "./Route";
import Router from "./Router";
import { Main, About } from "@/Pages";

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
