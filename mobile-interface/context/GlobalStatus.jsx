import React, { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [focusContact, setFocusContact] = useState({
    id: '0',
    name: 'Rem',
    initial: 'R'
  })
  const [focusContent, setFocusContent] = useState(1);
  const [incoming, setIncoming] = useState({});
  const [callProcess, setCallProcess] = useState({});

  useEffect(() => {
    if (!callProcess.mode) {
      const callInformation = {
        mode: 'incoming',
        user: user,
        contact: incoming
      }
      setCallProcess(callInformation);
    }
  }, [incoming])

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        webSocket,
        setWebSocket,
        focusContact,
        setFocusContact,
        focusContent,
        setFocusContent,
        callProcess,
        setCallProcess
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;