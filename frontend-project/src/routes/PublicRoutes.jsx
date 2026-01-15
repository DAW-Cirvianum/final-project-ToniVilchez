import { Navigate } from "react-router-dom";

export default function PublicRoutes({ children }) {
  const token = localStorage.getItem("token");
  
  if (token) {
    return <Navigate to="/categories" />;
  }
  
  return children;
}
