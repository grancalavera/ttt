import React from "react";

interface LogoutButtonProps {
  onLogout: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => (
  <button onClick={onLogout}>Logout</button>
);
