import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('caca_token');
    
    // Se não tiver token, empurra de volta para a página de login
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    // Se tiver token, deixa-o entrar no componente
    return children;
};

export default function App() {
    return (
        
        <Routes>
            {/* Rota Pública: A Landing Page */}
            <Route path="/" element={<Home />} />
            
            {/* Rota Pública: O ecrã de Login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rota Protegida: O Painel de Administração */}
            <Route 
                path="/admin" 
                element={
                    <ProtectedRoute>
                        <Admin />
                    </ProtectedRoute>
                } 
            />
        </Routes>
    );
}
