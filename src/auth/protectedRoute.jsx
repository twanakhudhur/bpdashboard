// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "@/components/loading";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
