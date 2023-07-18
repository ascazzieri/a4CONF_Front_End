import React, { useState, createContext } from "react";

export const SparkContext = createContext(undefined);

const SparkProvider = ({ children }) => {
  const [spark, setSpark] = useState(false);
  return (
    <SparkContext.Provider value={[spark, setSpark]}>
      {children}
    </SparkContext.Provider>
  );
};

export default SparkProvider;
