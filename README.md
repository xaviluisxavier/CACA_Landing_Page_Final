# CACA — Centro Académico Clínico dos Açores

Site institucional com painel de administração para o Centro Académico Clínico dos Açores, construído em React (frontend) e Node.js/Express (backend).

---

## Índice

- [Visão Geral](#visão-geral)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Instalar](#como-instalar)
- [Variáveis de Ambiente (.env)](#variáveis-de-ambiente-env)
- [Páginas e Componentes](#páginas-e-componentes)
- [Backend — Rotas da API](#backend--rotas-da-api)
- [Base de Dados](#base-de-dados)
- [APIs Externas Utilizadas](#apis-externas-utilizadas)
- [Fluxo de Autenticação](#fluxo-de-autenticação)

---

## Visão Geral

O CACA é uma plataforma web com duas grandes partes:

**Landing Page pública** — apresenta o centro, as suas áreas de investigação, parceiros, oportunidades, eventos, notícias de saúde e um formulário de contacto/newsletter.

**Painel de Administração** (área reservada) — permite a um administrador autenticado gerir eventos (criar, editar, apagar) e ver/exportar a lista de subscritores da newsletter.

---

## Estrutura do Projeto

```
projeto/
│
├── backend/
│   ├── server.js          ← Servidor Express (API + proxy para APIs externas)
│   ├── models/
│   │   └── User.js        ← Modelo MongoDB do utilizador administrador
│   └── .env               ← Chaves secretas e configurações
│
└── frontend/  (src/)
    ├── main.jsx            ← Ponto de entrada React
    ├── App.jsx             ← Rotas da aplicação (público/protegido)
    ├── pages/
    │   ├── Home.jsx        ← Landing page (junta todos os componentes)
    │   ├── Admin.jsx       ← Painel de administração
    │   └── Login.jsx       ← Ecrã de login
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx  ← Cabeçalho e navegação
    │   │   └── Footer.jsx  ← Rodapé com botão "voltar ao topo"
    │   ├── sections/
    │   │   ├── Hero.jsx          ← Secção principal com carrossel de imagens
    │   │   ├── ResearchAreas.jsx ← Áreas de investigação
    │   │   ├── Partners.jsx      ← Parceiros institucionais
    │   │   ├── Opportunities.jsx ← Oportunidades 
    │   │   ├── Events.jsx        ← Eventos com mapa e meteorologia
    │   │   ├── News.jsx          ← Notícias de saúde
    │   │   └── Contact.jsx       ← Formulário de contacto / newsletter
    │   └── ui/
    │       ├── logo-3d.jsx         ← Logo animado em Three.js
    │       └── ChartOportunidades.jsx ← Gráfico de barras com D3.js
    └── services/
        └── db.js           ← Base de dados local (IndexedDB) para eventos e newsletter
```

---

## Tecnologias Utilizadas

| Camada | Tecnologia | Para quê |
|---|---|---|
| Frontend | React + Vite | Interface do utilizador |
| Routing | React Router | Navegação entre páginas |
| Mapas | Leaflet.js | Mostrar localização dos eventos |
| Gráficos | D3.js | Gráfico de oportunidades |
| Logo | Three.js | Logo 3D animado no cabeçalho |
| BD Local | IndexedDB (via db.js) | Guardar eventos e subscritores da newsletter no browser |
| Backend | Node.js + Express | Servidor de API |
| BD Remota | MongoDB (Mongoose) | Guardar utilizadores administradores |
| Auth | JWT + bcrypt | Login seguro com token |
| Notícias | GNews API | Notícias de saúde em português |
| Meteorologia | OpenWeather API | Tempo atual nos locais dos eventos |

---

## Como Instalar

### Pré-requisitos
- Node.js (v18+)
- Uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas) (ou MongoDB local)
- Chaves de API para OpenWeather e GNews 

### 1. Instalar dependências do Backend

```bash
cd backend
npm install
```

### 2. Configurar o ficheiro `.env`

Cria um ficheiro `.env` na pasta `backend/` com o seguinte conteúdo (ver [secção abaixo](#variáveis-de-ambiente-env)).

### 3. Arrancar o servidor Backend

```bash
cd backend
node server.js
```

### 4. Instalar dependências do Frontend

```bash
cd frontend
npm install
```

### 5. Arrancar o Frontend

```bash
cd frontend
npm run dev
# Disponível em http://localhost:5173
```

> **Nota:** Em produção, o Vite gera uma pasta `dist/` que pode ser servida diretamente pelo Express com `app.use(express.static(...))`.

### 6. Criar o primeiro utilizador administrador

Como o registo (`/api/register`) é uma rota protegida, o primeiro admin tem de ser criado manualmente, por exemplo via MongoDB Compass ou com um script, inserindo diretamente na coleção `users` um documento com a password encriptada com bcrypt.

---

## Variáveis de Ambiente (.env)

```env
PORT=                              # Porta do servidor Express

MONGO_URI=mongodb+srv://...        # URI de ligação ao MongoDB Atlas

JWT_SECRET=                        # Chave secreta para assinar tokens JWT


OPENWEATHER_API_KEY=...            # Chave da API OpenWeatherMap (meteorologia dos eventos)
GNEWS_API_KEY=...                  # Chave da API GNews (notícias de saúde)
```

---

## Páginas e Componentes

### `Home.jsx` — Landing Page
Agrega todos os componentes públicos em sequência: cabeçalho → hero → investigação → parceiros → oportunidades → eventos → notícias → contacto → rodapé.

### `Login.jsx` — Ecrã de Login
Formulário simples que envia as credenciais para `POST /api/login`. Se o login for bem-sucedido, guarda o token JWT no `localStorage` e redireciona para `/admin`.

### `Admin.jsx` — Painel de Administração
Rota protegida (só acessível com token válido). Permite:
- Criar, editar e apagar eventos (guardados no IndexedDB do browser).
- Ver a lista de subscritores da newsletter.
- Exportar a lista de subscritores como ficheiro `.csv`.

### `Hero.jsx`
Secção de entrada com carrossel automático de 3 imagens (muda a cada 5 segundos) e um botão que revela a secção de Áreas de Investigação.

### `Events.jsx`
Lê os eventos do IndexedDB e para cada um cria um cartão com:
- Mapa interativo Leaflet centrado nas coordenadas do evento.
- Meteorologia atual (temperatura, descrição, vento) obtida via `/api/weather`.
- Data, hora, local e descrição.

### `News.jsx`
Procura notícias de saúde em português via `/api/noticias` (proxy para GNews). Inclui um filtro de deduplicação que remove artigos com títulos muito semelhantes.

### `ResearchAreas.jsx`
Apresenta as 5 áreas de investigação do CACA em cartões coloridos: e-Saúde, Inteligência Artificial, Telemedicina, Epidemiologia Regional e Saúde Pública. Cada cartão tem ícone, título e descrição. A secção está inicialmente oculta e é revelada pelo botão "Conheça as Nossas Áreas" do Hero.

### `Partners.jsx`
Grelha estática com os 5 parceiros institucionais do CACA: Universidade dos Açores, Hospital Regional dos Açores, Governo Regional dos Açores, Centros de Investigação e Parceiros Internacionais. Cada parceiro tem um ícone e nome.

### `Opportunities.jsx`
Apresenta 4 tipos de oportunidades em cartões (Estágios, Projetos de Investigação, Teses/Dissertações e Bolsas de Investigação) e integra logo abaixo o componente `ChartOportunidades` com o gráfico histórico de oportunidades.

### `ChartOportunidades.jsx`
Gráfico de barras animado feito com D3.js mostrando o crescimento de oportunidades ao longo dos anos. Inclui tooltip interativo.

### `Contact.jsx`
O componente mais complexo da landing page — contém duas secções distintas:
 
**Secção de Contacto:**
- Mapa Leaflet fixo centrado em Ponta Delgada (coordenadas da sede do CACA).
- Informações de contacto estáticas (email, telefone, morada).
- Formulário com validação em tempo real para nome (mín. 3 caracteres), email (aceita apenas domínios `@uac.pt`, `@gmail.com`, `@outlook.com`), telefone com indicativo de país (🇵🇹 +351, 🇧🇷 +55, 🇪🇸 +34) com regras diferentes por país, morada (opcional) e assunto (dropdown). Ao selecionar o assunto, a caixa de mensagem é pré-preenchida automaticamente com uma mensagem-padrão correspondente. Os campos ficam a verde quando válidos e a vermelho com mensagem de erro quando inválidos.
**Secção de Newsletter:**
- Formulário simples com nome e email (mesmas regras de validação).
- Ao submeter, guarda o email no IndexedDB via `salvarSubscritor()`. Se o email já existir, mostra um erro.

### `logo-3d.jsx`
Renderiza o logótipo do CACA num canvas Three.js com rotação contínua no eixo Y. Integrado no cabeçalho.

### `db.js` — Serviço de Base de Dados Local
Abstração sobre o IndexedDB do browser. Gere duas tabelas:
- `eventos` — eventos criados no painel de administração.
- `newsletter` — emails dos subscritores.

Expõe funções como `obterTodosEventos()`, `salvarEvento()`, `removerEvento()`, `salvarSubscritor()`, `obterSubscritores()`, `removerSubscritor()`.

---

## Backend — Rotas da API

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/api/login` | Público | Autentica um utilizador e devolve um token JWT |
| `POST` | `/api/register` | Protegido (JWT) | Cria um novo administrador |
| `GET` | `/api/weather` | Público | Proxy para OpenWeather (parâmetros: `lat`+`lon` ou `q`) |
| `GET` | `/api/noticias` | Público | Proxy para GNews com cache de 1 hora |

### Middleware `verificarToken`
Verifica o cabeçalho `Authorization: Bearer <token>` em todas as rotas protegidas. Se o token for inválido ou expirado, devolve erro 400/401.

---

## Base de Dados

### MongoDB (remoto) — `User`
Guarda apenas os utilizadores administradores. Campos: `nome`, `email`, `password` (encriptada com bcrypt), `role` (`user` ou `admin`), `createdAt`, `updatedAt`.

### IndexedDB (local no browser)
Guarda dados que não precisam de servidor: eventos do calendário e subscritores da newsletter. Os dados ficam no browser do utilizador — se limpar os dados do browser, os dados perdem-se.

---

## APIs Externas Utilizadas

### OpenWeatherMap
- Documentação: https://openweathermap.org/api
- Usada em: `Events.jsx` → `/api/weather` (proxy no backend para esconder a chave)
- Devolve temperatura, descrição do tempo e velocidade do vento para as coordenadas de cada evento.

### GNews
- Documentação: https://gnews.io/docs
- Usada em: `News.jsx` → `/api/noticias` (proxy com cache de 1h)
- Pesquisa artigos em português sobre e-saúde, telemedicina, IA, epidemiologia e investigação clínica.

---

## Fluxo de Autenticação

```
Utilizador → POST /api/login (email + password)
                    ↓
            Servidor verifica no MongoDB
                    ↓
            Gera token JWT (válido 1 hora)
                    ↓
        Frontend guarda token em localStorage
                    ↓
        Rota /admin verifica localStorage
        (sem token → redireciona para /login)
```

O token é incluído no cabeçalho de cada pedido protegido:
```
Authorization: Bearer <token>
```

---

## Nota
- O sistema de eventos usa IndexedDB (browser), o que significa que os eventos criados no Admin só são visíveis no mesmo browser onde foram criados.
