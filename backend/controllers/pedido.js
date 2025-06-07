const Pedido = require('../models/pedido.model');
const Vendedor = require('../models/vendedor.model');

async function getCarrinho(req, res) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  try {
    // Supondo que o método no model se chame getCarrinhoPorIdVendedor
    const carrinhoData = await Pedido.getCarrinhoPorIdVendedor(user.id_usuario);
    if (!carrinhoData) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }

    return res.json(carrinhoData);
  } catch (err) {
    console.error('Erro ao buscar carrinho:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

module.exports = { getCarrinho };
