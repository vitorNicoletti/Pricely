const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const catalogoRouter = require('./routes/catalogo');
const cadastroRouter = require('./routes/cadastro');
const vendedorRouter = require("./routes/vendedor");
const fornecedorRouter = require("./routes/fornecedor");
const loginRouter = require('./routes/login');
const carrinhoRouter = require('./routes/carrinho');
const logoutRouter    = require('./routes/logout');
const produtoRoutes   = require('./routes/produto');
dotenv.config(); // Carrega variáveis do .env

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/carrinho', carrinhoRouter )
app.use('/api/produtos', produtoRoutes);
app.use("/api", catalogoRouter);
app.use('/api/logout', logoutRouter);

app.use("/api/vendedor", vendedorRouter);
app.use("/api/fornecedor", fornecedorRouter);
app.use('/api/cadastro',cadastroRouter )
app.use('/api/login',loginRouter )


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}...`);
});