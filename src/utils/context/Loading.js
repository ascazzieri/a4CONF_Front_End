import { useState, createContext, useEffect } from "react";

export const LoadingContext = createContext(undefined);

export default function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (loading) {
      // Imposta un timeout di 10 secondi
      timeoutId = setTimeout(() => {
        setLoading(false); // Reimposta loading a false dopo 10 secondi
      }, 10000);
    }

    return () => {
      // Cancella il timeout se il componente viene smontato prima che scada
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loading]);

  return (
    <LoadingContext.Provider value={[loading, setLoading]}>
      {children}
    </LoadingContext.Provider>
  );
}
