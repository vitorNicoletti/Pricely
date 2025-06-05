const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const catalogoRoutes = require("./routes/catalogo");
const vendedorRoutes = require("./routes/vendedor");
const fornecedorRoutes = require("./routes/fornecedor");

app.use("/api", catalogoRoutes);
app.use("/api/vendedor", vendedorRoutes);
app.use("/api/fornecedor", fornecedorRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}...`);
});
