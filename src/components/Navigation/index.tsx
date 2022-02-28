import { useSession } from "next-auth/react";
import React, { FC } from "react";
import useSWR from "swr";
import { UserEntity } from "../../types";
import { Authenticated } from "./Authenticated";
import { NotAuthenticated } from "./NotAthenticated";

interface Props {}

const Navigation: FC<Props> = () => {
  const { data: session, status } = useSession();
  const { data: user, mutate } = useSWR<UserEntity, any>("/api/users");

  const isAuthenticated = status !== "loading" && session;

  const authenticatedProps = { user, mutate };

  return isAuthenticated ? (
    <Authenticated {...authenticatedProps} />
  ) : (
    <NotAuthenticated />
  );
};

export { Navigation };
