import React, { useState, useEffect } from 'react';

export default function Hero() {
  // 1. Lógica do Carrossel 
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Array com as imagens
  const slides = [
    { src: '/assets/imagem.jpg', alt: "Paisagem dos Açores" },
    { src: '/assets/uac.jpg', alt: "Universidade dos Açores" },
    { src: '/assets/governo-acores.jpg', alt: "Governo dos Açores" }
  ];

  useEffect(() => {
    // Muda a imagem a cada 5 segundos
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    
    // Limpeza do timer quando mudamos de página
    return () => clearInterval(timer);
  }, [slides.length]);

 
  // 2. Lógica do botão "Saber Mais" 
  const handleSaberMais = (e) => {
    e.preventDefault();
    const section = document.getElementById('investigacao');
    
    if (section) {
      // O 'toggle' tira a classe se ela existir, ou mete a classe se não existir
      section.classList.toggle('visible'); 

      // Só faz scroll para baixo se a secção tiver acabado de abrir
      if (section.classList.contains('visible')) {
        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  return (
    <section id="missao" className="hero">
      <div className="hero-pattern"></div>
      <div className="container hero-content">
        <div className="hero-text">
          <h2 className="hero-title">Construindo o Futuro<br />da Saúde nos Açores</h2>
          <p className="hero-description">
            Uma parceria inovadora entre a Universidade dos Açores e instituições
            de saúde regionais, dedicada à investigação clínica de excelência,
            ao ensino de qualidade e à melhoria dos cuidados de saúde nas ilhas.
          </p>
          {/* evento onClick */}
          <button type="button" className="btn cta-button" id="SaberMais" onClick={handleSaberMais}>
            Conheça as Nossas Áreas
          </button>
        </div>
        <div className="hero-image">
          <div className="carousel" id="heroCarousel">
            <div className="carousel-inner">
              {slides.map((slide, index) => (
                <img 
                  key={index}
                  src={slide.src} 
                  alt={slide.alt} 
                  // A classe 'active' só é adicionada à imagem que corresponde ao currentSlide
                  className={`carousel-item ${index === currentSlide ? 'active' : ''}`} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
