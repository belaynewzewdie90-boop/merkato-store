import { Navigate } from "react-router-dom";

export default function AuthGuard({ children }) {
  const user = JSON.parse(localStorage.getItem("merkato_current_user"));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
