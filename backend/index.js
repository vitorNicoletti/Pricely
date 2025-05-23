import express from 'express';
import cors from 'cors';
import Routes from './Routes/Routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', Routes);

app.use((req, res) => {
    console.log(`Rota não encontrada: ${req.method} ${req.url}`);
    res.status(404).json({ error: "Endpoint não encontrado" });
  });
  
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});