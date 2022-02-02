import { signIn, useSession } from "next-auth/react";
import React, { FC, useEffect } from "react";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute: FC<Props> = ({ children }) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const isUser = !!session?.user;

  useEffect(() => {
    if (loading) return; // Do nothing while loading
    if (!isUser) signIn(); // If not authenticated, force log in
  }, [isUser, loading]);

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <></>;
};

export { ProtectedRoute };
