import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { salvarSubscritor } from '../../services/db';

export default function Contact() {
    const mapRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', indicativo: '+351', address: '', subject: '', message: ''
    });

    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterName, setNewsletterName] = useState('');

    // Validação Formulário Contacto
    const isNameValid = formData.name.length === 0 ? null : formData.name.trim().length >= 3;
    const regexEmail = /^[^\s@]+@(uac\.pt|gmail\.com|outlook\.com)$/i;
    const isEmailValid = formData.email.length === 0 ? null : regexEmail.test(formData.email);
    
    // Validação de Telemóvel por País
    const checkPhoneValidity = (indicativo, phone) => {
        if (phone.length === 0) return null;
        const limpo = phone.replace(/\s/g, '');

        if (indicativo === '+351') {
            return limpo.startsWith('9') && limpo.length === 9;
        }
        if (indicativo === '+55') {
            return limpo.length === 10 || limpo.length === 11; 
        }
        if (indicativo === '+34') {
            return (limpo.startsWith('6') || limpo.startsWith('7')) && limpo.length === 9;
        }
        return limpo.length >= 8;
    };
    const isPhoneValid = checkPhoneValidity(formData.indicativo, formData.phone);

    // --- Lógica de Validação (Newsletter) ---
    const isNewsNameValid = newsletterName.length === 0 ? null : newsletterName.trim().length >= 3;
    const isNewsEmailValid = newsletterEmail.length === 0 ? null : regexEmail.test(newsletterEmail);

    const mensagensPreDefinidas = {
        "Informações Gerais": "Gostaria de obter mais informações gerais sobre o Centro Académico Clínico dos Açores.",
        "Estágios e Oportunidades": "Tenho interesse nas oportunidades de estágio. Poderiam enviar-me os requisitos?",
        "Parcerias": "Represento uma instituição e gostaríamos de explorar uma potencial parceria convosco.",
        "Apoio": "Necessito de apoio em relação a..."
    };

    useEffect(() => {
        if (!mapRef.current) return;
        const map = L.map(mapRef.current, { attributionControl: false }).setView([37.7451, -25.6675], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.marker([37.7451, -25.6675]).addTo(map).bindPopup('<b>CACA - Ponta Delgada</b>').openPopup();
        return () => map.remove();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const novoEstado = { ...prev, [name]: value };
            if (name === 'subject') {
                const msgAtual = prev.message.trim();
                const eMsgPadrao = Object.values(mensagensPreDefinidas).includes(msgAtual);
                if (msgAtual === "" || eMsgPadrao) {
                    novoEstado.message = mensagensPreDefinidas[value] || "";
                }
            }
            return novoEstado;
        });
    };

    const handleSubmitContact = (e) => {
        e.preventDefault();
        if (!isNameValid || !isEmailValid || !isPhoneValid) {
            alert("Por favor, corrija os erros no formulário antes de enviar.");
            return;
        }
        if (window.confirm(`Deseja enviar a mensagem?`)) {
            alert('Mensagem enviada com sucesso!');
            setFormData({ name: '', email: '', phone: '', indicativo: '+351', address: '', subject: '', message: '' });
        }
    };

    const handleSubmitNewsletter = async (e) => {
        e.preventDefault();
        if (!isNewsNameValid || !isNewsEmailValid) {
            alert("Por favor, introduza um nome e email válidos.");
            return;
        }

        try {
            await salvarSubscritor(newsletterEmail);
            alert(`Obrigado ${newsletterName}! Subscreveu a nossa newsletter com sucesso.`);
            setNewsletterName('');
            setNewsletterEmail('');
        } catch (erro) {
            alert(erro.message || "Erro ao subscrever a newsletter."); 
        }
    };

    return (
        <>
            <section id="contactos" className="contacts">
                <div className="container">
                    <header className="section-header">
                        <h2 className="section-title">Contactos</h2>
                    </header>

                    <div className="contact-wrapper">
                        <div className="contact-info">
                            <h3 className="contact-info-title">Informações de Contacto</h3>
                            <div className="contact-item">
                                <strong className="contact-label">Email</strong>
                                <a href="mailto:geral@caca.uac.pt" className="contact-value">geral@caca.uac.pt</a>
                            </div>
                            <div className="contact-item">
                                <strong className="contact-label">Telefone</strong>
                                <span className="contact-value">+351 296 650 000</span>
                            </div>
                            <div className="contact-item">
                                <strong className="contact-label">Morada</strong>
                                <address className="contact-value">
                                    Campus de Ponta Delgada<br />
                                    Rua da Mãe de Deus, 9500-321<br />
                                    Ponta Delgada, São Miguel, Açores
                                </address>
                            </div>
                            
                            <div id="contact-map" className="contact-map" ref={mapRef}></div>
                        </div>

                        <div className="contact-form-wrapper">
                            <h3 className="contact-form-title">Envie uma Mensagem</h3>
                            <p className="form-mandatory-note">Os campos com * são obrigatórios.</p>
                            
                            <form className="contact-form" onSubmit={handleSubmitContact}>
                                <div className="form-group">
                                    <div className="input-with-icon">
                                        <span className="input-icon"><i className="fi fi-rr-user"></i></span>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            placeholder="Nome completo *" 
                                            value={formData.name} 
                                            onChange={handleChange} 
                                            className={isNameValid === true ? 'input-success' : isNameValid === false ? 'input-error' : ''}
                                            required 
                                        />
                                    </div>
                                    {isNameValid === false && <span className="error-text">O nome deve ter 3 ou mais letras.</span>}
                                </div>
                                
                                <div className="form-group">
                                    <div className="input-with-icon">
                                        <span className="input-icon"><i className="fi fi-rr-envelope"></i></span>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            placeholder="Endereço de email *" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            className={isEmailValid === true ? 'input-success' : isEmailValid === false ? 'input-error' : ''}
                                            required 
                                        />
                                    </div>
                                    {isEmailValid === false && <span className="error-text">Use domínios @uac.pt, @gmail.com ou @outlook.com</span>}
                                </div>

                                <div className="form-group">
                                    <div className="input-with-icon">
                                        <span className="input-icon"><i className="fi fi-rr-smartphone"></i></span>
                                        <select name="indicativo" className="country-select" value={formData.indicativo} onChange={handleChange}>
                                            <option value="+351">🇵🇹 +351</option>
                                            <option value="+55">🇧🇷 +55</option>
                                            <option value="+34">🇪🇸 +34</option>
                                        </select>
                                        <input 
                                            type="tel" 
                                            name="phone" 
                                            placeholder="Número de telemóvel *" 
                                            value={formData.phone} 
                                            onChange={handleChange} 
                                            className={isPhoneValid === true ? 'input-success' : isPhoneValid === false ? 'input-error' : ''}
                                            required 
                                        />
                                    </div>
                                    {isPhoneValid === false && formData.indicativo === '+351' && <span className="error-text">Em Portugal, deve ter 9 dígitos e começar por 9.</span>}
                                    {isPhoneValid === false && formData.indicativo === '+55' && <span className="error-text">No Brasil, deve ter 10 ou 11 dígitos (com DDD).</span>}
                                    {isPhoneValid === false && formData.indicativo === '+34' && <span className="error-text">Em Espanha, deve ter 9 dígitos e começar por 6 ou 7.</span>}
                                </div>

                                <div className="form-group">
                                    <div className="input-with-icon">
                                        <span className="input-icon"><i className="fi fi-rr-marker"></i></span>
                                        <input type="text" name="address" placeholder="Morada (Opcional)" value={formData.address} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-with-icon">
                                        <span className="input-icon"><i className="fi fi-rr-document"></i></span>
                                        <select name="subject" required value={formData.subject} onChange={handleChange}>
                                            <option value="" disabled>Selecione o Assunto *</option>
                                            <option value="Informações Gerais">Informações Gerais</option>
                                            <option value="Estágios e Oportunidades">Estágios e Oportunidades</option>
                                            <option value="Parcerias">Parcerias Institucionais</option>
                                            <option value="Apoio">Apoio / Outros</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-with-icon">
                                        <span className="input-icon align-top"><i className="fi fi-rr-comment"></i></span>
                                        <textarea name="message" rows="5" placeholder="Escreva aqui a sua mensagem *" value={formData.message} onChange={handleChange} required></textarea>
                                    </div>
                                </div>
                                
                                <button type="submit" className="btn submit-button">Enviar Mensagem</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECÇÃO NEWSLETTER COM VALIDAÇÃO --- */}
            <section id="newsletter" className="newsletter-section"> 
                <div className="container">
                    <header className="section-header">
                        <h2 className="section-title">Subscreva a nossa Newsletter</h2>
                        <p className="section-subtitle">Receba as últimas novidades sobre investigação e saúde.</p>
                    </header>

                    <div className="newsletter-wrapper">
                        <form className="contact-form" onSubmit={handleSubmitNewsletter}> 
                            <div className="form-group">
                                <div className="input-with-icon">
                                    <span className="input-icon"><i className="fi fi-rr-user"></i></span>
                                    <input 
                                        type="text" 
                                        placeholder="O seu nome completo *" 
                                        value={newsletterName} 
                                        onChange={(e) => setNewsletterName(e.target.value)} 
                                        className={isNewsNameValid === true ? 'input-success' : isNewsNameValid === false ? 'input-error' : ''}
                                        required 
                                    />
                                </div>
                                {isNewsNameValid === false && <span className="error-text">O nome deve ter 3 ou mais letras.</span>}
                            </div>
                            <div className="form-group">
                                <div className="input-with-icon">
                                    <span className="input-icon"><i className="fi fi-rr-envelope"></i></span>
                                    <input 
                                        type="email" 
                                        placeholder="O seu email *" 
                                        value={newsletterEmail} 
                                        onChange={(e) => setNewsletterEmail(e.target.value)} 
                                        className={isNewsEmailValid === true ? 'input-success' : isNewsEmailValid === false ? 'input-error' : ''}
                                        required 
                                    />
                                </div>
                                {isNewsEmailValid === false && <span className="error-text">Use domínios @uac.pt, @gmail.com ou @outlook.com</span>}
                            </div>
                            <button type="submit" className="btn submit-button newsletter-submit-btn">Subscrever Agora</button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
