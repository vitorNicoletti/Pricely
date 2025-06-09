const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const produtoRoutes   = require('./routes/produto');
const catalogoRouter  = require('./routes/catalogo');
const cadastroRouter  = require('./routes/cadastro');
const vendedorRouter  = require('./routes/vendedor');
const fornecedorRouter= require('./routes/fornecedor');
const loginRouter     = require('./routes/login');
const logoutRouter    = require('./routes/logout');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// monta primeiro as rotas de produto
app.use('/api/produtos', produtoRoutes);

// depois as rotas mais genéricas
app.use('/api', catalogoRouter);
app.use('/api/cadastro', cadastroRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/vendedor', vendedorRouter);
app.use('/api/fornecedor', fornecedorRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}...`);
});