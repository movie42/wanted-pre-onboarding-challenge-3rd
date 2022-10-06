import { useRouter } from "@/lib/hook";
import React from "react";

interface ILinkProps {
  children: React.ReactNode;
  to: string;
}

const Link = ({ children, to }: ILinkProps) => {
  const { push } = useRouter();
  return (
    <a
      onClick={(e) => {
        e.preventDefault();
        push(to);
      }}
    >
      {children}
    </a>
  );
};

export default Link;
