import { NextPage } from "next";

export type ProtectedPage<Props> = NextPage<Props> & { isProtected?: boolean };
