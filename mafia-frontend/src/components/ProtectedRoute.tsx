import React from "react";
import { useNavigate } from "@tanstack/react-router";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate({ to: "/auth" });
    }
  }, [navigate]);
  return <>{children}</>;
};

export default ProtectedRoute;