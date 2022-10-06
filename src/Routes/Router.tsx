import { useRouter } from "@/lib/hook";
import React, { createContext, useEffect, useState } from "react";

interface LocationContextProps {
  location: {
    pathName: string;
  };
  setLocation: React.Dispatch<
    React.SetStateAction<{
      pathName: string;
    }>
  >;
}

export const LocationContext = createContext<LocationContextProps>(null!);

interface IRoutesProps {
  children: React.ReactNode;
}

const Router = ({ children }: IRoutesProps) => {
  const [location, setLocation] = useState({ pathName: "/" });

  return (
    <LocationContext.Provider
      children={children}
      value={{ location, setLocation }}
    />
  );
};

export default Router;
