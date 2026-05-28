import React, { useState, useEffect, useRef } from 'react';
import { obterTodosEventos } from '../../services/db';
import L from 'leaflet';

// Sub-componente que desenha CADA cartão de evento
function EventCard({ evento }) {
    const mapRef = useRef(null);
    const [meteo, setMeteo] = useState(null);

    // Formatar a data
    const dataObj = evento.data ? new Date(evento.data + 'T00:00:00') : null;
    const dia = dataObj ? dataObj.toLocaleDateString('pt-PT', { day: '2-digit' }) : '--';
    const mes = dataObj ? dataObj.toLocaleDateString('pt-PT', { month: 'short' }).toUpperCase() : '---';

    useEffect(() => {
        let mapInstance = null;
        if (evento.lat && evento.lng && mapRef.current) {
            mapInstance = L.map(mapRef.current, { attributionControl: false }).setView([evento.lat, evento.lng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
            L.marker([evento.lat, evento.lng]).addTo(mapInstance).bindPopup(`<b>${evento.local}</b>`).openPopup();
            
            fetch(`/api/weather?lat=${evento.lat}&lon=${evento.lng}`)
                .then(res => res.json())
                .then(data => {
                    if(data.weather && data.main) {
                        setMeteo({
                            temp: Math.round(data.main.temp),
                            desc: data.weather[0].description,
                            vento: Math.round(data.wind.speed * 3.6),
                            icone: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
                        });
                    }
                })
                .catch(err => console.error("Erro meteo:", err));
        }
        return () => { if (mapInstance) mapInstance.remove(); };
    }, [evento]);

    return (
        <article className="evento-card">
            <div className="evento-mapa-container">
                <div className="evento-mapa" ref={mapRef}></div>
                <div className="caca-date-badge">
                    <div className="d-day">{dia}</div>
                    <div className="d-month">{mes}</div>
                </div>
            </div>
            <div className="evento-body">
                <h3 className="evento-titulo">{evento.titulo}</h3>
                <div className="evento-info">
                    {evento.hora && <span className="evento-hora-wrapper"><i className="fi fi-rr-clock"></i> <span className="evento-hora">{evento.hora}</span></span>}
                    <span><i className="fi fi-rr-marker"></i> <span className="evento-local">{evento.local}</span></span>
                </div>
                {evento.descricao && <p className="evento-descricao">{evento.descricao}</p>}
                
                <div className="evento-meteo-wrapper">
                    {meteo ? (
                        <div className="meteo-card">
                            <img className="meteo-icon" src={meteo.icone} alt={meteo.desc} />
                            <div className="meteo-texto">
                                <div className="meteo-temp"><strong>{meteo.temp}</strong>ºC - <span className="m-desc">{meteo.desc}</span></div>
                                <div className="meteo-vento">Vento: <span className="m-vento">{meteo.vento}</span> km/h</div>
                            </div>
                        </div>
                    ) : (
                        evento.lat && (
                            <div className="evento-meteo-loading">
                                <div className="spinner-small"></div>
                                <span>A carregar meteorologia...</span>
                            </div>
                        )
                    )}
                </div>
            </div>
        </article>
    );
}

// O Componente Principal da Secção
export default function Events() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obterTodosEventos().then(dados => {
            setEventos(dados);
            setLoading(false);
        }).catch(err => {
            console.error("Erro a carregar IndexedDB:", err);
            setLoading(false);
        });
    }, []);

    return (
        <section id="eventos" className="eventos-section">
            <div className="container">
                <header className="section-header">
                    <h2 className="section-title">Próximos Eventos</h2>
                    <p className="section-subtitle">Fique a par das atividades e eventos do CACA</p>
                </header>
                <div className="eventos-grid" id="eventosGrid">
                    {loading && <p className="eventos-status">A carregar eventos...</p>}
                    
                    {!loading && eventos.length === 0 && (
                        <div className="eventos-empty">
                            <span className="empty-icon">📭</span>
                            <p>Não há eventos agendados de momento.</p>
                        </div>
                    )}

                    {!loading && eventos.map(ev => (
                        <EventCard key={ev.id} evento={ev} />
                    ))}
                </div>
            </div>
        </section>
    );
}
