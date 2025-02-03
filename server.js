require('dotenv').config();
const express = require('express');
const sequelize = require('./config/dbconfig'); // Importando a configuração do banco de dados
const passport = require('./config/passport'); // Importando a configuração do Passport
const session = require('express-session');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
// Middlewares para parse do JSON
app.use(bodyParser.json());



// Rotas de retorno (back_urls)
app.get('/success', (req, res) => res.send("Pagamento realizado com sucesso!"));
app.get('/failure', (req, res) => res.send("O pagamento falhou. Tente novamente."));
app.get('/pending', (req, res) => res.send("Pagamento pendente. Aguarde a confirmação."));


// Importar as rotas
const shopRoutes = require('./src/routes/ShopRouter');
const userRoutes = require('./src/routes/UserRouter');
const barberRoutes = require('./src/routes/BarberRouter');
const servicoRoutes = require('./src/routes/ServicoRouter');
const agendaRoutes = require('./src/routes/AgendaRouter');
const graficoRoutes = require('./src/routes/GraficoRouter'); // Importando as rotas de gráficos
const authRoutes = require('./src/routes/authRoutes'); // Importando as rotas de autenticação
const paymentRoutes = require('./src/routes/PaymentRouter'); // Importando as rotas de pagamentos
const mpRoutes = require('./src/routes/mpRouter');// Importa as rotas já mercado Pago
const webhookRoutes = require('./src/routes/webhookRoutes');// Importa a rota de webhook


// Usar as rotas
app.use('/api', shopRoutes);
app.use('/api', userRoutes);
app.use('/api', barberRoutes);
app.use('/api', servicoRoutes);
app.use('/api', agendaRoutes);
app.use('/api', graficoRoutes); // Usar as rotas de gráficos
app.use('/api', paymentRoutes); // Usar as rotas de pagamentos
app.use('/', authRoutes); // Usar as rotas de autenticação
app.use('/api/mp', mpRoutes);// Rotas da API do Mercado Pago

// Rota para receber notificações (webhook)
// Essa rota ficará em: http://localhost:3000/api/mp/webhook
app.use('/api/mp', webhookRoutes);

// Função para testar a conexão com o banco de dados
function testDatabaseConnection() {
    sequelize.authenticate()
        .then(() => {
            console.log(`Conexão com o banco de dados bem-sucedida! O banco permanece ativo. horario: ${new Date().toLocaleString()}`);
        })
        .catch(err => {
            console.error('Erro ao conectar ao banco de dados:', err);
        });
}

// Testar a conexão com o banco de dados a cada 5 minutos (300000 milissegundos)
setInterval(testDatabaseConnection, 300000);

// Testando a conexão com o banco de dados e iniciando o servidor
sequelize.authenticate()
    .then(() => {
        console.log(`Conexão com o banco de dados bem-sucedida! horario: ${new Date().toLocaleString()}`);
        app.listen(PORT, () => {
            console.log(`Servidor rodando no localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });
