
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const catalogoRouter = require('./routes/catalogo');
const cadastroRouter = require('./routes/cadastro');
const vendedorRoutes = require("./routes/vendedor");
const fornecedorRoutes = require("./routes/fornecedor");
const loginRouter = require('./routes/login');
dotenv.config(); // Carrega variáveis do .env


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", catalogoRoutes);
app.use("/api/vendedor", vendedorRoutes);
app.use("/api/fornecedor", fornecedorRoutes);
app.use('/api/cadastro',cadastroRouter )
app.use('/api/login',loginRouter )

app.use("/api/vendedor", vendedorRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}...`);
});
