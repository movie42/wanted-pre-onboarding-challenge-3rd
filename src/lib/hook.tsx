import { LocationContext } from "@/Routes/Router";
import { useContext } from "react";

export const useRouter = () => {
  const { setLocation } = useContext(LocationContext);

  function push(to: string) {
    setLocation({ pathName: to });

    return history.pushState(null, "", to);
  }

  return { push };
};
