const Pedido = require("../models/pedido.model")

async function getPedidos(req, res) {

    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    try {
        // Supondo que o método no model se chame getCarrinhoPorIdVendedor
        const pedidosData = await Pedido.getPedidosPorIdVendedor(user.id_usuario);
        if (!pedidosData) {
            return res.status(404).json({ error: 'Sem pedidos feitos' });
        }

        return res.json(pedidosData);
    } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
}
    module.exports = { getPedidos }