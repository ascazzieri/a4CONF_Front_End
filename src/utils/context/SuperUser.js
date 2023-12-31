import { useState, createContext } from "react";

export const SuperUserContext = createContext(undefined);

export default function SuperUserProvider({ children }) {
  const [superUser, setSuperUser] = useState(false);
  return (
    <SuperUserContext.Provider value={[superUser, setSuperUser]}>
      {children}
    </SuperUserContext.Provider>
  );
}
