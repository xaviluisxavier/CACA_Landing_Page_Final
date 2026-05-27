import React from 'react';
import ChartOportunidades from '../ui/ChartOportunidades';

export default function Opportunities() {
    return (
        <section id="oportunidades" className="opportunities">
            <div className="container">
                <header className="section-header">
                    <h2 className="section-title">Oportunidades</h2>
                    <p className="section-subtitle">Junte-se a nós na construção do futuro da saúde</p>
                </header>

                <div className="opportunities-grid">
                    <article className="opportunity-card" tabIndex="0">
                        <div className="opportunity-icon"><i className="fi fi-rr-graduation-cap"></i></div>
                        <h3 className="opportunity-title">Estágios</h3>
                        <p className="opportunity-description">Programas de estágio em investigação clínica e áreas tecnológicas de saúde.</p>
                    </article>
                    <article className="opportunity-card" tabIndex="0">
                        <div className="opportunity-icon"><i className="fi fi-rr-microscope"></i></div>
                        <h3 className="opportunity-title">Projetos de Investigação</h3>
                        <p className="opportunity-description">Oportunidades de participação em projetos inovadores financiados por programas de saúde.</p>
                    </article>
                    <article className="opportunity-card" tabIndex="0">
                        <div className="opportunity-icon"><i className="fi fi-rr-book"></i></div>
                        <h3 className="opportunity-title">Teses e Dissertações</h3>
                        <p className="opportunity-description">Temas de investigação para mestrados e doutoramentos nas áreas da saúde.</p>
                    </article>
                    <article className="opportunity-card" tabIndex="0">
                        <div className="opportunity-icon"><i className="fi fi-rr-coins"></i></div>
                        <h3 className="opportunity-title">Bolsas de Investigação</h3>
                        <p className="opportunity-description">Bolsas de investigação apoiando projetos de excelência em saúde e inovação biomédica.</p>
                    </article>
                </div>
                
                {/* Injetar o Gráfico Aqui */}
                <ChartOportunidades/>

            </div>
        </section>
    );
}