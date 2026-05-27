import React from 'react';

export default function Partners() {
    return (
        <section id="parceiros" className="partners">
            <div className="container">
                <header className="section-header">
                    <h2 className="section-title">Nossos Parceiros</h2>
                    <p className="section-subtitle">Colaboração institucional para excelência em saúde e investigação</p>
                </header>

                <div className="partners-grid">
                    <div className="partner-box" tabIndex="0"><div className="partner-icon"><i className="fi fi-rr-graduation-cap"></i></div><h3 className="partner-name">Universidade dos Açores</h3></div>
                    <div className="partner-box" tabIndex="0"><div className="partner-icon"><i className="fi fi-rr-hospital"></i></div><h3 className="partner-name">Hospital Regional dos Açores</h3></div>
                    <div className="partner-box" tabIndex="0"><div className="partner-icon"><i className="fi fi-rr-building"></i></div><h3 className="partner-name">Governo Regional dos Açores</h3></div>
                    <div className="partner-box" tabIndex="0"><div className="partner-icon"><i className="fi fi-rr-microscope"></i></div><h3 className="partner-name">Centros de Investigação</h3></div>
                    <div className="partner-box" tabIndex="0"><div className="partner-icon"><i className="fi fi-rr-globe"></i></div><h3 className="partner-name">Parceiros Internacionais</h3></div>
                </div>
                <p className="partners-note">+ várias outras instituições colaboradoras</p>
            </div>
        </section>
    );
}