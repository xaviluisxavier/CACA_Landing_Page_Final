import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obterTodosEventos, salvarEvento, removerEvento, obterSubscritores, removerSubscritor } from '../services/db';


export default function Admin() {
    const [eventos, setEventos] = useState([]);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('caca_token');
        navigate('/login'); // Redireciona
    };
    
    const [formData, setFormData] = useState({
        titulo: '', data: '', hora: '', local: '', lat: '', lng: '', descricao: ''
    });

    const [subscritores, setSubscritores] = useState([]);

    useEffect(() => {
        carregarEventos();
        carregarListaSubscritores();
    }, []);

    const carregarEventos = async () => {
        const dados = await obterTodosEventos();
        setEventos(dados);
    };

    const carregarListaSubscritores = async () => {
        const dados = await obterSubscritores();
        setSubscritores(dados);
    };

    const handleRemoverSubscritor = async (id) => {
    if (window.confirm("Tem a certeza que quer remover este subscritor?")) {
        await removerSubscritor(id);
        carregarListaSubscritores();
    }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const eventoParaGuardar = {
            ...formData,
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng),
            ...(isEditing && { id: formData.id })
        };

        try {
            await salvarEvento(eventoParaGuardar);
            alert(isEditing ? "Evento atualizado com sucesso!" : "Evento criado com sucesso!");
            resetForm();
            carregarEventos();
        } catch (err) {
            alert("Erro ao processar evento.");
        }
    };

    const handleEdit = (evento) => {
        setFormData(evento);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Deseja apagar este evento?")) {
            await removerEvento(id);
            carregarEventos();
        }
    };

    const resetForm = () => {
        setFormData({ titulo: '', data: '', hora: '', local: '', lat: '', lng: '', descricao: '' });
        setIsEditing(false);
    };

    const handleExportCSV = () => {
    if (subscritores.length === 0) {
        alert("Não há subscritores para exportar.");
        return;
    }

    // 1. Definir o cabeçalho do CSV
    const cabecalho = ["ID", "Email", "Data de Subscricao"];
    
    // 2. Converter os dados para linhas de texto
    const linhas = subscritores.map(sub => [
        sub.id,
        sub.email,
        sub.data
    ].join(",")); // Junta cada campo com uma vírgula

    // 3. Juntar tudo (Cabeçalho + Conteúdo)
    const csvContent = [cabecalho.join(","), ...linhas].join("\n");

    // 4. Criar o ficheiro e fazer o download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", `subscritores_caca_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

    return (
        <div className="admin-body">
            
            <header className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-header-left">
                        <div className="admin-header-brand">
                            <h1>CACA <span className="badge">Admin</span></h1>
                        </div>
                    </div>
                    <div className="admin-header-right">
                        <Link to="/" className="btn-back">
                            <i className="fi fi-rr-arrow-left"></i> Voltar ao Site
                        </Link>
                        <button className="btn-logout" onClick={() => {localStorage.removeItem('caca_token'); navigate('/'); }}>
                            <i className="fi fi-rr-sign-out-alt"></i> Sair
                        </button>
                    </div>
                </div>
            </header>

            {/* CONTEÚDO PRINCIPAL */}
            <main className="admin-content container">
                <div className="admin-grid">
                    
                    {/* COLUNA ESQUERDA: Formulário */}
                    <div className="form-panel">
                        <h2>
                            <i className="fi fi-rr-edit"></i> 
                            {isEditing ? 'Editar Evento' : 'Novo Evento'}
                        </h2>
                        
                        <form className="admin-form" onSubmit={handleSubmit}>
                            <div className="field-group">
                                <label>Título do Evento *</label>
                                <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
                            </div>

                            <div className="form-row">
                                <div className="field-group">
                                    <label>Data *</label>
                                    <input type="date" name="data" value={formData.data} onChange={handleChange} required />
                                </div>
                                <div className="field-group">
                                    <label>Hora</label>
                                    <input type="time" name="hora" value={formData.hora} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="field-group">
                                <label>Local / Cidade *</label>
                                <input type="text" name="local" value={formData.local} onChange={handleChange} required />
                            </div>

                            {/* Separador Visual para as Coordenadas */}
                            <div className="form-divider"></div>
                            <span className="form-section-label">Coordenadas do Mapa</span>

                            <div className="form-row">
                                <div className="field-group">
                                    <label>Latitude *</label>
                                    <input type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} required />
                                </div>
                                <div className="field-group">
                                    <label>Longitude *</label>
                                    <input type="number" step="any" name="lng" value={formData.lng} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="field-group">
                                <label>Descrição</label>
                                <textarea name="descricao" value={formData.descricao} onChange={handleChange}></textarea>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-save">
                                    {isEditing ? 'Atualizar Evento' : 'Guardar Evento'}
                                </button>
                                {/* O botão cancelar usa a classe 'visible' para aparecer quando estamos a editar */}
                                <button type="button" className={`btn-cancel ${isEditing ? 'visible' : ''}`} onClick={resetForm}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* COLUNA DIREITA: Lista */}
                    <div className="list-panel">
                        <div className="list-panel-header">
                            <h2>
                                <i className="fi fi-rr-calendar"></i> Eventos Agendados
                                <span className="event-count">{eventos.length}</span>
                            </h2>
                        </div>

                        <div className="events-list">
                            {eventos.length === 0 ? (
                                <div className="empty-state">
                                    <i className="fi fi-rr-box-open empty-icon"></i>
                                    <p>Sem eventos marcados</p>
                                    <small>Utilize o formulário para adicionar.</small>
                                </div>
                            ) : (
                                eventos.map(ev => (
                                    <div key={ev.id} className="event-card-admin">
                                        <div className="event-card-top">
                                            <h3>{ev.titulo}</h3>
                                            <div className="event-card-actions">
                                                <button className="btn-edit" onClick={() => handleEdit(ev)} title="Editar">
                                                    <i className="fi fi-rr-edit"></i>
                                                </button>
                                                <button className="btn-delete" onClick={() => handleDelete(ev.id)} title="Apagar">
                                                    <i className="fi fi-rr-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="event-meta">
                                            <span><i className="fi fi-rr-calendar-lines"></i> {ev.data}</span>
                                            {ev.hora && <span><i className="fi fi-rr-clock"></i> {ev.hora}</span>}
                                            <span><i className="fi fi-rr-marker"></i> {ev.local}</span>
                                        </div>
                                        
                                        {ev.descricao && (
                                            <div className="event-desc">{ev.descricao}</div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
                    <div className="newsletter-panel">
                    <div className="newsletter-panel-header">
                        <div className="newsletter-panel-title">
                            <i className="fi fi-rr-envelope"></i>
                            <h2>Subscritores da Newsletter</h2>
                            <span className="event-count">{subscritores.length}</span>
                        </div>
                        <div className="newsletter-panel-actions">
                            <button className="btn-export" onClick={handleExportCSV}>
                                <i className="fi fi-rr-download"></i> Exportar Lista
                            </button>
                        </div>
                    </div>

                    <div className="subscribers-table-wrapper">
                        <table className="subscribers-table">
                            <thead>
                                <tr>
                                    <th><i className="fi fi-rr-at"></i> Email</th>
                                    <th><i className="fi fi-rr-calendar"></i> Data de Subscrição</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscritores.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="empty-state-td">
                                            <i className="fi fi-rr-envelope-open empty-icon"></i>
                                            <p>Ainda não há subscritores.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    subscritores.map((sub) => (
                                        <tr key={sub.id}>
                                            <td><strong>{sub.email}</strong></td>
                                            <td>{sub.data}</td>
                                            <td>
                                                <button 
                                                    className="btn-delete btn-unsub" 
                                                    onClick={() => handleRemoverSubscritor(sub.id)}
                                                    title="Remover subscritor"
                                                >
                                                    <i className="fi fi-rr-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}