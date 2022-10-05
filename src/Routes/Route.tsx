import React, { useEffect } from "react";

interface IRouteProps {
  path: string;
  component: React.ReactElement;
  state?: {};
}

const Route = ({ path, component, state }: IRouteProps) => {
  useEffect(() => window.history.pushState(state, "", path), [path]);
  return component;
};

export default Route;
