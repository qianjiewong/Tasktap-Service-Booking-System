"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Role = "customer" | "tasker";

interface RoleContextProps {
  role: Role;
  switchRole: () => void;
}

const RoleContext = createContext<RoleContextProps | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(() => {
    // Check localStorage for the saved role, default to "customer" if none exists
    if (typeof window !== "undefined") {
      return (localStorage.getItem("role") as Role) || "customer";
    }
    return "customer";
  });

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  const switchRole = () => {
    setRole((prevRole) => {
      const newRole = prevRole === "customer" ? "tasker" : "customer";
      localStorage.setItem("role", newRole);
      return newRole;
    });
  };

  return (
    <RoleContext.Provider value={{ role, switchRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
