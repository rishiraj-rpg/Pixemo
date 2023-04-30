import React, { createContext, useState } from "react";

export const globalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [loggedin, setLoggedin] = useState(false);
  const [active, setActive] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <globalContext.Provider
      value={{
        loggedin,
        setLoggedin,
        active,
        setActive,
        currentUser,
        setCurrentUser,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </globalContext.Provider>
  );
};
