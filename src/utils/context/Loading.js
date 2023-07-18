import { useState, createContext } from "react";

export const LoadingContext = createContext(undefined);

export default function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={[loading, setLoading]}>
      {children}
    </LoadingContext.Provider>
  );
}
