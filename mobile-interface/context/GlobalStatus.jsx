import React, { createContext, useContext, useState } from "react";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [config, setConfig] = useState(require('./app-config'));
  const [user, setUser] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [focusContact, setFocusContact] = useState({
    id: '0',
    name: 'Rem',
    initial: 'R'
  })

  return (
    <GlobalContext.Provider
      value={{
        config,
        user,
        setUser,
        webSocket,
        setWebSocket,
        focusContact,
        setFocusContact
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;