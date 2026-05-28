// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo3D from '../ui/logo-3d';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header id="header" className="header">
            <div className="container header-content">
                <div className="logo-section">
                    <div className="logo">
                        <Logo3D />
                    </div>
                    
                    <div className="site-title">
                        <h1 className="title-main">Centro Académico Clínico dos Açores</h1>
                        <p className="title-sub">Inovação e Excelência em Saúde</p>
                    </div>
                </div>

                <nav className={`main-nav ${isMenuOpen ? 'active' : ''}`} id="mainNav">
                    <ul>
                        <li><a href="#parceiros" onClick={() => setIsMenuOpen(false)}>Parceiros</a></li>
                        <li><a href="#oportunidades" onClick={() => setIsMenuOpen(false)}>Oportunidades</a></li>
                        <li><a href="#eventos" onClick={() => setIsMenuOpen(false)}>Eventos</a></li>
                        <li><a href="#noticias" onClick={() => setIsMenuOpen(false)}>Notícias</a></li>
                        <li><a href="#contactos" onClick={() => setIsMenuOpen(false)}>Contacto</a></li>
                        <li><Link to="/admin" className="nav-admin-link">Área Reservada</Link></li>
                    </ul>
                </nav>

                <button type="button" className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    ☰
                </button>
            </div>
        </header>
    );
}
