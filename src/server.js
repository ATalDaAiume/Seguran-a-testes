require('dotenv').config();
const express = require('express');
const database = require('./config/database');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const helmet = require('helmet'); // Adicionado para segurança de cabeçalhos HTTP
const cors = require('cors'); // Adicionado para configurar CORS

/**
 * Instalações necessárias:
 * npm install express
 * npm install sequelize
 * npm install pg
 * npm install pg-hstore
 * npm install bcrypt
 * npm install jsonwebtoken
 * npm install dotenv
 * npm install cors
 * npm install mysql2
 * npm install mongoose
 * npm install helmet // Adicionar esta dependência
 */
console.log('Starting server....')
const app = express()

// 1. Aplica Helmet para configurar cabeçalhos HTTP relacionados à segurança
app.use(helmet()); 

// 2. Configuração básica de CORS. 
// Para produção, substitua { origin: '*' } por domínios específicos.
app.use(cors({
    origin: '*', // Permitindo todas as origens (ajustar em produção)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', routes);

const PORT = process.env.PORT || 3000; // Pega a porta do .env ou usa 3000 como padrão

// Removendo ou comentando { force: true } para evitar perda de dados em produção (use migrations em produção)
database.db.sync(/* { force: true } */) 
    .then(() => {
        // Usa a variável PORT aqui
        app.listen(PORT, () => {
            // Corrige a mensagem para mostrar a porta correta
            console.log(`Server is running on port ${PORT}`) 
        })
    })
    .catch((error) => {
        console.error('Error connecting to the database', error);
    });