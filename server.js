require('dotenv').config();
const express = require('express');
const sequelize = require('./config/dbconfig'); // Importando a configuração do banco de dados
const passport = require('./config/passport'); // Importando a configuração do Passport
const session = require('express-session');
const authRoutes = require('./src/routes/authRoutes'); // Importando as rotas de autenticação

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Importar as rotas
const shopRoutes = require('./src/routes/ShopRouter');
const userRoutes = require('./src/routes/UserRouter');
const barberRoutes = require('./src/routes/BarberRouter');
const servicoRoutes = require('./src/routes/ServicoRouter');
const agendaRoutes = require('./src/routes/AgendaRouter');

// Usar as rotas
app.use('/api', shopRoutes);
app.use('/api', userRoutes);
app.use('/api', barberRoutes);
app.use('/api', servicoRoutes);
app.use('/api', agendaRoutes);
app.use('/', authRoutes); // Usar as rotas de autenticação

// Testando a conexão com o banco de dados e iniciando o servidor
sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados bem-sucedida!');
        app.listen(PORT, () => {
            console.log(`Servidor rodando no localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });