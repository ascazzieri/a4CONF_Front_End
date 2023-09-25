import { useState, createContext } from "react";

export const SuperUserContext = createContext(undefined);

export default function LoadingProvider({ children }) {
  const [superUser, setSuperUser] = useState(true);
  return (
    <SuperUserContext.Provider value={[superUser, setSuperUser]}>
      {children}
    </SuperUserContext.Provider>
  );
}
