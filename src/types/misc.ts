import { NextPage } from "next";

export type ProtectedPage<Props> = NextPage<Props> & {
  isProtected?: boolean;
  isSeller?: boolean;
};

export interface FileWithPreview extends File {
  preview?: string;
}
