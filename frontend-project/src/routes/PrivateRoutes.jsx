import { Navigate } from "react-router-dom";

export default function PrivateRoutes({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/" />;
}
