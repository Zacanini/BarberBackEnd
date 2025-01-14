const express = require('express');
const sequelize = require('./config/dbconfig'); // Importando a configuração do banco de dados

const app = express();
const PORT = 3000;

app.use(express.json());

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