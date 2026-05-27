require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir os ficheiros estáticos do projeto (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '/')));

//Cache para notícias (1 hora)
let cacheNoticias = null; 
let ultimaAtualizacaoNoticias = 0; 
const TEMPO_CACHE_MILISSEGUNDOS = 60 * 60 * 1000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Ligado à Base de Dados MongoDB '))
  .catch((err) => console.error('Erro ao ligar ao MongoDB:', err));




const verificarToken = (req, res, next) => {
    // 1. Pega o token
    const token = req.header('Authorization');

    // 2. Se não houver token, barra a entrada
    if (!token) {
        return res.status(401).json({ erro: "Acesso negado. Token não fornecido." });
    }

    try {
        const tokenLimpo = token.replace('Bearer ', '');

        // 3. Verifica a validade do token usando a chave secreta
        const utilizadorVerificado = jwt.verify(tokenLimpo, process.env.JWT_SECRET);

        // 4. Guarda os dados do utilizador e manda-o entrar (next)
        req.user = utilizadorVerificado;
        next(); 
    } catch (err) {
        res.status(400).json({ erro: "Token inválido ou expirado." });
    }
};

app.post('/api/register', verificarToken, async (req, res) => {
    try {
        const { nome, email, password } = req.body;

        // Verifica se o email já existe
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ erro: "Email já registado." });

        // Encriptar a password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Criar o utilizador na Base de Dados
        const novoUser = await User.create({
            nome,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        res.status(201).json({ mensagem: "Administrador criado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao criar utilizador." });
    }
});


app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Procurar o utilizador pelo email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ erro: "Credenciais inválidas." });

        // 2. Verificar se a password bate certo com a encriptada
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ erro: "Credenciais inválidas." });

        // 3. Gerar o Token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } //expira numa hora
        );

        res.json({ mensagem: "Login efetuado com sucesso!", token: token, nome: user.nome });
    } catch (err) {
    console.error(" ERRO NO LOGIN:", err); 
    res.status(500).json({ erro: err.message }); 
}
});



// ROTA DE PROXY PARA METEOROLOGIA 
app.get('/api/weather', async (req, res) => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const { q, lat, lon } = req.query;

        let apiUrl = '';

        if (lat && lon) {
            apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt&appid=${apiKey}`;
        } else if (q) {
            apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=metric&lang=pt&appid=${apiKey}`;
        } else {
            return res.status(400).json({ error: 'Falta a cidade ou coordenadas' });
        }

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Erro na OpenWeather');

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Erro na Meteorologia:", error.message);
        res.status(500).json({ error: 'Falha ao processar a meteorologia' });
    }
});

//ROTA DE PROXY PARA NOTÍCIAS 
app.get('/api/noticias', async (req, res) => {
    try {
        const agora = Date.now();

        // Verifica se a Cache ainda é válida
        if (cacheNoticias && (agora - ultimaAtualizacaoNoticias < TEMPO_CACHE_MILISSEGUNDOS)) {
            console.log("A devolver notícias da CACHE");
            return res.json({ status: 'ok', items: cacheNoticias });
        }

        const apiKey = process.env.GNEWS_API_KEY;
        
        const termosPesquisa = encodeURIComponent('("e-saúde" OR "telemedicina" OR "inteligência artificial" OR "epidemiologia" OR "investigação clínica") AND (saúde OR medicina)');
        const apiUrl = `https://gnews.io/api/v4/search?q=${termosPesquisa}&lang=pt&country=pt&max=10&apikey=${apiKey}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Erro na GNews API: ${response.status}`);

        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            // Guarda diretamente na Cache
            cacheNoticias = data.articles;
            ultimaAtualizacaoNoticias = agora;
            res.json({ status: 'ok', items: cacheNoticias });
        } else {
            throw new Error('A API não devolveu resultados.');
        }

    } catch (error) {
        console.error("Erro nas Notícias:", error.message);
        
        // Se a API falhar, mostra as notícias de ontem que estão na Cache
        if (cacheNoticias) {
            console.log("API falhou, a devolver Cache como emergência.");
            return res.json({ status: 'ok', items: cacheNoticias, aviso: 'Dados em cache'});
        }
        res.status(500).json({ error: 'Falha ao processar as notícias' });
    }
});


// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor em http://localhost:${PORT}`);
});
