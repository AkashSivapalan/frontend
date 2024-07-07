import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoutes = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }
    return user ? <Outlet /> : <Navigate to='/login' />
    
}

export default PrivateRoutes;