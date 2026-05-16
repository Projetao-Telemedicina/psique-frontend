import React from 'react';
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
export declare const AuthProvider: ({ children }: {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAuth: () => AuthContextType;
export {};
