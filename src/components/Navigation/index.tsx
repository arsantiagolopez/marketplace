import { useSession } from "next-auth/react";
import React, { FC } from "react";
import { Authenticated } from "./Authenticated";
import { NotAuthenticated } from "./NotAthenticated";

interface Props {}

const Navigation: FC<Props> = () => {
  const { data: session, status } = useSession();

  const isAuthenticated = status !== "loading" && session;

  return isAuthenticated ? <Authenticated /> : <NotAuthenticated />;
};

export { Navigation };
