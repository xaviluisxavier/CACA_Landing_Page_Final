import React, { useState, useEffect } from 'react';

export default function News() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const filtrarNoticiasSemelhantes = (artigos) => {
        if (!artigos || artigos.length === 0) return [];
        const unicos = [];

        for (const artigo of artigos) {
            let Duplicado = false;
            const palavrasArtigo = artigo.title.toLowerCase().replace(/[^\w\sà-ú]/gi, '').split(/\s+/).filter(w => w.length > 3);

            for (const noticiaUnica of unicos) {
                const palavrasUnica = noticiaUnica.title.toLowerCase().replace(/[^\w\sà-ú]/gi, '').split(/\s+/).filter(w => w.length > 3);
                
                const palavrasRepetidas = palavrasArtigo.filter(w => palavrasUnica.includes(w)).length;
                const baseComparacao = Math.min(palavrasArtigo.length, palavrasUnica.length);

                if (baseComparacao > 0 && (palavrasRepetidas / baseComparacao) > 0.5) {
                    Duplicado = true;
                    break;
                }
            }
            if (!Duplicado) unicos.push(artigo);
        }
        return unicos;
    };

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('/api/noticias');
                const data = await response.json();
                
                if (data.items) {
                    const filtradas = filtrarNoticiasSemelhantes(data.items);
                    setArticles(filtradas.slice(0, 3)); 
                } else {
                    throw new Error("Formato de dados inválido");
                }
            } catch (err) {
                console.error("Erro ao carregar notícias:", err);
                setError("Não foi possível carregar as notícias de saúde.");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return (
        <section id="noticias" className="noticias-section">
            <div className="container">
                <header className="section-header">
                    <h2 className="section-title">Notícias de Saúde</h2>
                    <p className="section-subtitle">Mantenha-se atualizado com as últimas descobertas e informações da área da saúde.</p>
                </header>
                
                <div id="noticiasGrid" className="noticias-grid">
                    {loading && <p className="noticias-status">A carregar notícias de saúde...</p>}
                    
                    {error && <p className="noticias-status error">{error}</p>}
                    
                    {!loading && !error && articles.map((item, index) => (
                        <article key={index} className="noticia-card">
                            <div className="noticia-imagem">
                                <img 
                                    src={item.image || '/assets/logo-caca.svg'} 
                                    alt={item.title} 
                                    onError={(e) => { e.target.src = '/assets/logo-caca.svg'; }}
                                />
                            </div>
                            <div className="noticia-body">
                                <span className="noticia-data">
                                    {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('pt-PT') : 'Data recente'}
                                </span>
                                <h3 className="noticia-titulo">{item.title}</h3>
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-ver-mais">Ler Artigo</a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
