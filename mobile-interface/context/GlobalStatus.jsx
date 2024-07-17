import React, { createContext, useContext, useState } from "react";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [webSocket, setWebSocket] = useState(null);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        webSocket,
        setWebSocket
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;