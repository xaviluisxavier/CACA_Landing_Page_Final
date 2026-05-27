import React from 'react';

export default function ResearchAreas() {
  const areas = [
    { id: 'e-saude', title: 'e-Saúde', icon: 'fi-rr-laptop', color: 'card-blue', desc: 'Desenvolvimento de plataformas digitais para gestão de saúde e telesaúde.' },
    { id: 'ia', title: 'Inteligência Artificial', icon: 'fi-rr-brain', color: 'card-green', desc: 'Aplicação de machine learning para diagnóstico precoce e otimização clínica.' },
    { id: 'telemedicina', title: 'Telemedicina', icon: 'fi-rr-video-camera', color: 'card-orange', desc: 'Soluções inovadoras de teleconsulta para populações insulares.' },
    { id: 'epidemiologia', title: 'Epidemiologia Regional', icon: 'fi-rr-chart-histogram', color: 'card-purple', desc: 'Estudos de prevalência de doenças e fatores de risco nos Açores.' },
    { id: 'saude-publica', title: 'Saúde Pública', icon: 'fi-rr-heart', color: 'card-red', desc: 'Promoção da saúde e intervenções comunitárias adaptadas à realidade açoriana.' }
  ];

  return (
    <section id="investigacao" className="research-areas">
      <div className="container">
        <header className="section-header">
          <h2 className="section-title">Áreas de Investigação</h2>
          <p className="section-subtitle">Desenvolvendo soluções inovadoras para os desafios da saúde regional e global</p>
        </header>

        <div className="research-grid">
          {areas.map(area => (
            <article key={area.id} className={`research-card ${area.color}`} tabIndex="0">
              <div className="card-icon-wrapper"><i className={`fi ${area.icon}`}></i></div>
              <div className="card-header"><h3 className="card-title">{area.title}</h3></div>
              <p className="card-description">{area.desc}</p>
              <span className="card-arrow">→</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}