import React, { createContext, useState } from "react";

interface LocationContextProps {
  location: {
    pathName: string;
  };
}

const LocationContext = createContext<LocationContextProps>(null!);

interface IRoutesProps {
  children: React.ReactNode;
}

const Router = ({ children }: IRoutesProps) => {
  const [location, setLocation] = useState({ pathName: "/" });
  return <LocationContext.Provider children={children} value={{ location }} />;
};

export default Router;
