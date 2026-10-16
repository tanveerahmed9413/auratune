import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FullScreenLoader } from "../../../components/ui/Loader";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenLoader label="Loading AuraTune..." />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
