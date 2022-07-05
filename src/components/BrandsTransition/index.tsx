import React, { FC, useEffect, useState } from "react";

interface Props {}

interface Brand {
  name: string;
  image: string;
  width: number;
}

const BrandsTransition: FC<Props> = () => {
  const [startAnimation, setStartAnimation] = useState<boolean>(false);

  const brands: Brand[] = [
    {
      name: "mcdonalds",
      image: "/brands/mcdonalds.png",
      width: 230,
    },
    {
      name: "starbucks",
      image: "/brands/starbucks.png",
      width: 230,
    },
    {
      name: "dominos",
      image: "/brands/dominos.png",
      width: 220,
    },
    {
      name: "chickfila",
      image: "/brands/chickfila.png",
      width: 200,
    },
  ];

  let randomBrand = brands[Math.floor(Math.random() * brands.length)];

  const [active, setActive] = useState<Brand>(randomBrand);

  // Change brand every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Prevent repeated brand
      if (active === randomBrand) {
        while (active === randomBrand) {
          randomBrand = brands[Math.floor(Math.random() * brands.length)];
        }
      }
      setStartAnimation(true);
      setActive(randomBrand);
    }, 5000);

    return () => clearInterval(interval);
  }, [brands]);

  return (
    <div
      className={`absolute pl-3 md:pl-2 pr-1 md:pr-3 right-2 md:right-0 w-44 md:w-60
      ${
        active?.name === "chickfila" ? "bottom-[-5px]" : "bottom-2 md:bottom-1"
      } ${startAnimation && "transition-[fade_5s_ease-in-out]"}`}
    >
      <img src={active?.image} width={active?.width} alt={active?.name} />
    </div>
  );
};

export { BrandsTransition };
