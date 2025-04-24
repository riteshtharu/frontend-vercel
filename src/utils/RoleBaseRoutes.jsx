import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RoleBaseRoutes = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    
    if (!decoded?.role || !requiredRole.includes(decoded.role)) {
      return <Navigate to="/" />;
    }

    return children;
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/login" />;
  }
};

export default RoleBaseRoutes;