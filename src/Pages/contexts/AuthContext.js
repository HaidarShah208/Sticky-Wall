import React, { useState, useEffect, createContext, useContext, useReducer } from 'react';
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged
import { auth } from '../Config/Config'; // Import the 'auth' variable correctly

const AuthContext = createContext();
const initialState = { isAuth: false, user: {} };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_LOGGED_IN':
      return { isAuth: true, user: payload.user };
    case 'SET_LOGGED_OUT':
      return initialState;
    default:
      return state;
  }
};

export default function AuthContextProvider({ children }) {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Use onAuthStateChanged to listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        dispatch({ type: 'SET_LOGGED_IN', payload: { user } });
      } else {
        // User is signed out
        dispatch({ type: 'SET_LOGGED_OUT' });
      }
      setIsAppLoading(false);
    });

    return () => unsubscribe(); // Unsubscribe from the listener when the component unmounts
  }, []);

  return (
    <AuthContext.Provider value={{ isAppLoading, ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);