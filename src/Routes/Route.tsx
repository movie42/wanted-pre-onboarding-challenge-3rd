import React, { useContext, useEffect, useState } from "react";
import { LocationContext } from "./Router";

interface IRouteProps {
  path: string;
  component: JSX.Element;
  state?: {};
}

const Route = ({ path, component, state }: IRouteProps) => {
  const { pathname } = window.location;
  const [isPath, setIsPath] = useState(false);
  const { setLocation } = useContext(LocationContext);

  const route = (pathname: string) => {
    if (path === pathname) {
      setIsPath(true);
    } else {
      setIsPath(false);
    }

    window.onpopstate = () => {
      setLocation({ pathName: pathname });
    };
  };

  useEffect(() => {
    route(pathname);
  }, [pathname]);

  return isPath ? component : null;
};

export default Route;
