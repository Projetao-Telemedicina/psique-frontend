import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'PROFESSIONAL' | 'PATIENT';
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    
    const getUserFromToken = (t: string | null): User | null => {
        if (!t) return null;
        try {
            return jwtDecode<User>(t);
        } catch {
            return null;
        }
    };

    const [user, setUser] = useState<User | null>(getUserFromToken(token));
    const navigate = useNavigate();

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        const decodedUser = getUserFromToken(newToken);
        
        setToken(newToken);
        setUser(decodedUser);

        if (decodedUser?.role === 'ADMIN') {
            navigate('/admin/validacao');
        } else {
            navigate('/perfil/paciente');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ 
            token, 
            user, 
            isAuthenticated: !!token, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth deve estar dentro do AuthProvider");
    return context;
};