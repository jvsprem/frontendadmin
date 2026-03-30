import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

const login = (data) => {
  const formattedUser = {
    ...data,
    role: data.role || data.user?.role
  };

  localStorage.setItem("user", JSON.stringify(formattedUser));
  setUser(formattedUser);
};

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};