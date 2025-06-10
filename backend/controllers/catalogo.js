const Produtos = require('../models/produtos.model');

/**
 * Retorna detalhes de um produto pelo ID.
 */
async function getProductDetails(req, res) {
  const { id } = req.params;

  // Valida ID numérico

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ message: "ID inválido." });
  }

  try {
    const produto = await Produtos.getById(Number(id));
    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }
    return res.status(200).json(produto);
  } catch (err) {
    console.error('Erro ao buscar produto:', err);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
}

/**
 * Retorna todos os produtos, opcionalmente limitando pela quantidade (qnt).
 */
async function getAllProducts(req, res) {
  const { qnt } = req.body || {};

  // Valida quantidade opcionalmente
  if (qnt !== undefined && (isNaN(qnt) || Number(qnt) < 1)) {
    return res.status(400).json({ message: 'Quantidade inválida.' });
  }

  try {
    // getAll agora retorna uma Promise
    const resultados = await Produtos.getAll();
    // Aplica limite se solicitado
    const limited = qnt ? resultados.slice(0, Number(qnt)) : resultados;
    return res.status(200).json(limited);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
}

module.exports = {
  getAllProducts,
  getProductDetails
};
