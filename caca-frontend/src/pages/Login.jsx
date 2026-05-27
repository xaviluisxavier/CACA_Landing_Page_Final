import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('caca_token', data.token);
                navigate('/admin');
            } else {
                setError(data.erro || 'Credenciais inválidas.');
            }
        } catch (err) {
            setError('Erro de ligação ao servidor.');
        }
    };

    return (
        <div className="login-overlay">
            {/* Lado Esquerdo: Brand  */}
            <div className="login-brand">
                <span className="login-brand-eyebrow">Área Reservada</span>
                <h1 className="login-brand-title">CACA<br />Admin</h1>
                <div className="login-brand-line"></div>
            </div>

            {/* Lado Direito: Formulário */}
            <div className="login-form-side">
                <h2>Bem-vindo</h2>
                <p>Introduza as suas credenciais para aceder ao painel.</p>

                <form onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label>E-mail</label>
                        <input
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                            placeholder="seu@email.pt"
                            className="login-input"
                        />
                    </div>

                    <div className="login-field">
                        <label>Palavra-passe</label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            className="login-input"
                        />
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <button type="submit" className="btn-login">
                        ENTRAR NO SISTEMA
                    </button>
                </form>
                
                {/* O bloco que limpámos: */}
                <div className="login-back-wrapper">
                    <Link to="/" className="login-back-link">
                        <i className="fi fi-rr-arrow-left"></i> Voltar ao site principal
                    </Link>
                </div>
                
            </div>
        </div>
    );
}