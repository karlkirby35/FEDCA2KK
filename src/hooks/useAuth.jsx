import { createContext, useContext, useState, useEffect } from "react";
import axios from "@/config/api";

// Create Auth Context to store auth state
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Auth Provider component to wrap the app and provide auth state
// children is a prop that represents the nested components
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);

    const onLogin = async (email, password) => {
        try {
            const response = await axios.post("/login", { email, password });
            localStorage.setItem("token", response.data.token);
            setToken(response.data.token);
        } catch (err) {
            console.log(err.response?.data || err);
        }
    };

  const onRegister = async ({ first_name, last_name, email, password }) => {
  try {
    const response = await axios.post("/register", { first_name, last_name, email, password });
    localStorage.setItem("token", response.data.token);
    setToken(response.data.token);
  } catch (err) {
    console.log(err.response?.data || err);
  }
};


    const onLogout = () => {
        setToken(null);
        localStorage.removeItem("token");
    };

    const value = {
        token,
        onLogin,
        onRegister, 
        onLogout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
