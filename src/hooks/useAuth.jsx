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
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const onLogin = async (email, password) => {
        try {
            const response = await axios.post("/login", { email, password });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user || { email }));
            setToken(response.data.token);
            setUser(response.data.user || { email });
            //logging token when logging in
            console.log("Login successful! Token:", response.data.token);
        } catch (err) {
            console.log(err.response?.data || err);
        }
    };

  const onRegister = async ({ first_name, last_name, email, password }) => {
  try {
    const response = await axios.post("/register", { first_name, last_name, email, password });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user || { first_name, last_name, email }));
    setToken(response.data.token);
    setUser(response.data.user || { first_name, last_name, email });
  } catch (err) {
    console.log(err.response?.data || err);
  }
};


    const onLogout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    const value = {
        token,
        user,
        onLogin,
        onRegister, 
        onLogout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
