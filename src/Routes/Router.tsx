import React from "react";

interface IRoutesProps {
  children: React.ReactElement;
}

const Router = ({ children }: IRoutesProps) => {
  return children;
};

export default Router;
