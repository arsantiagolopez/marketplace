import { NextPage } from "next";

export type ProtectedPage<Props> = NextPage<Props> & { isProtected?: boolean };

export interface FileWithPreview extends File {
  preview?: string;
}
