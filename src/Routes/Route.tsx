import { changeRouter } from "@/lib/lib";
import React, { useEffect, useState } from "react";

interface IRouteProps {
  path: string;
  component: React.ReactElement;
  state?: {};
}

const Route = ({ path, component, state }: IRouteProps) => {
  const [isPath, setIsPath] = useState(false);

  useEffect(() => {
    const { pathname } = window.location;
    if (path === pathname) {
      setIsPath(true);
      changeRouter(path);
    }
  }, [path]);

  return isPath ? component : null;
};

export default Route;
