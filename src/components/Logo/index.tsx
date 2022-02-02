import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";

interface Props {}

const Logo: FC<Props> = () => (
  <Link href="/">
    <a>
      <Image
        src="/logo.png"
        alt="Tri Payments"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority={true}
      />
    </a>
  </Link>
);

export { Logo };
