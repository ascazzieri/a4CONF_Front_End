import { useState, createContext } from "react";

export const TerafenceContext = createContext(undefined);

export default function SuperUserProvider({ children }) {
  const [terafenceServices, setTerafenceServices] = useState({
    tf_bchnld: false,
    tf_http_xfer: false,
    tf_cfgmng: false,
    mosquitto: false,
  });
  return (
    <TerafenceContext.Provider
      value={[terafenceServices, setTerafenceServices]}
    >
      {children}
    </TerafenceContext.Provider>
  );
}
