import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, provider } from "./firebase";

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const signIn = () => {
    auth.signInWithPopup(provider);
  };

  const SignOut = () => {
    auth.signOut();
  };

  const [user, setUser] = useState();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });

  const value = {
    user,
    signIn,
    SignOut,
  };

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);
