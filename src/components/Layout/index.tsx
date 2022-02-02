import React, { FC } from "react";
import { Navigation } from "../Navigation";

interface Props {
  children: JSX.Element;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col">
      <Navigation />
      <div className="flex flex-col pt-16 md:pt-20">{children}</div>
    </div>
  );
};

export { Layout };
