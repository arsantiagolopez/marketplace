import React, { FC, ReactNode, useState } from "react";
import { PreferencesContext } from "./PreferencesContext";

interface Props {
  children: ReactNode;
}

const PreferencesProvider: FC<Props> = ({ children }) => {
  const [currency, setCurrency] = useState<string>(
    process.env.NEXT_PUBLIC_PREFERRED_CURRENCY || "USD"
  );

  const toggleCurrency = () => {
    setCurrency(currency === "USD" ? "ETH" : "USD");
  };

  return (
    <PreferencesContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export { PreferencesProvider };
