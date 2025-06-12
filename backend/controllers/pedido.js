const Pedido = require("../models/pedido.model");

async function getPedidoByID(req, res) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  // Extrai e valida o ID do pedido da URL: /pedidos/:id
  const idPedido = Number(req.params.id);
  if (!Number.isInteger(idPedido) || idPedido <= 0) {
    return res.status(400).json({ error: 'ID de pedido inválido' });
  }

  try {
    // Supondo que exista um método no model chamado getPedidoPorId
    const pedidoData = await Pedido.getPedidoPorId(idPedido,user.id_usuario);
    if (!pedidoData) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    return res.json(pedidoData);
  } catch (err) {
    console.error('Erro ao buscar pedido por ID:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

async function getPedidos(req, res) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  try {
    const pedidosData = await Pedido.getPedidosPorIdVendedor(user.id_usuario);
    if (!pedidosData || pedidosData.length === 0) {
      return res.status(404).json({ error: 'Sem pedidos feitos' });
    }

    return res.json(pedidosData);
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

module.exports = { getPedidoByID, getPedidos };
