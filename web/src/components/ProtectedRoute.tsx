import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredType?: 'admin' | 'siswa';
}

export default function ProtectedRoute({ children, requiredType }: ProtectedRouteProps) {
    const { isAuthenticated, userType } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to={requiredType === 'admin' ? '/login' : '/signin'} replace />;
    }

    if (requiredType && userType !== requiredType) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
