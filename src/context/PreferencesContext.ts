import { createContext, Dispatch, SetStateAction } from "react";

interface ContextState {
  currency: string;
  setCurrency: Dispatch<SetStateAction<string>>;
  toggleCurrency: () => void;
}

const PreferencesContext = createContext<ContextState>({
  currency: process.env.NEXT_PUBLIC_PREFERRED_CURRENCY || "USD",
  setCurrency: () => {},
  toggleCurrency: () => {},
});

export { PreferencesContext };
