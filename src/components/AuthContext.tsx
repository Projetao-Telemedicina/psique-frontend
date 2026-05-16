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
            interface JwtPayload {
                sub?: string;
                id?: string;
                email: string;
                role: 'ADMIN' | 'PROFESSIONAL' | 'PATIENT';
            }

            const decoded = jwtDecode<JwtPayload>(t);
            
            return {
                id: decoded.sub || decoded.id || '', 
                email: decoded.email,
                role: decoded.role
            };
        } catch (error) {
            console.error("Erro ao decodificar token:", error);
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

        // Redirecionamento baseado na Role
        if (decodedUser?.role === 'ADMIN') {
            navigate('/admin/validacao');
        } else if (decodedUser?.role === 'PATIENT') {
            navigate('/perfil/paciente');
        } else if (decodedUser?.role === 'PROFESSIONAL') {
            navigate('/perfil/profissional');
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