import React, { useState, useEffect } from 'react';

export default function Footer() {
    // Estado para saber se devemos mostrar o botão
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Adiciona o evento quando o componente aparece
        window.addEventListener("scroll", handleScroll);
        
        // Limpa o evento quando o componente desaparece 
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 3. A função para subir suavemente
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h2>CACA</h2>
                        <p>Inovação e Excelência em Saúde nos Açores. Uma parceria estratégica focada no desenvolvimento clínico e tecnológico da região autónoma.</p>
                    </div>
                    
                    <div className="footer-links-group">
                        <h3>Links Úteis</h3>
                        <div className="footer-links-list">
                            <a href="#privacidade">Política de Privacidade</a>
                            <a href="#acessibilidade">Acessibilidade</a>
                            <a href="#termos">Termos de Uso</a>
                        </div>
                    </div>

                    <div className="footer-social-wrapper">
                        <h3>Siga-nos</h3>
                        <div className="footer-social">
                            <a href="#facebook" aria-label="Facebook" className="social-link">FB</a>
                            <a href="#twitter" aria-label="X (Twitter)" className="social-link">X</a>
                            <a href="#linkedin" aria-label="LinkedIn" className="social-link">IN</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">© 2026 Centro Académico Clínico dos Açores (CACA). Todos os direitos reservados.</p>
                    <div className="footer-university">
                        <i className="fi fi-rr-graduation-cap"></i> Universidade dos Açores
                    </div>
                </div>
            </div>
            <button 
                type="button" 
                className="btn-top" 
                id="btn-topo" 
                aria-label="Voltar ao topo"
                onClick={scrollToTop}
                style={{ display: isVisible ? "block" : "none" }}
            >
                <i className="fi fi-rr-arrow-up"></i>
            </button>
        </footer>
    );
}