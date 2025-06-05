const Vendedor = require("../models/vendedor.model.js");

function getAllVendedores(req, res) {
  Vendedor.getAll((err, vendedores) => {
    if (err) {
      console.error("Erro ao buscar vendedores:", err);
      return res.status(500).json({ message: "Erro no servidor." });
    }
    return res.status(200).json(vendedores);
  });
}

function getVendedorDetails(req, res) {
  const { id } = req.params;

  // Valida se o id é numérico. Se não for, devolve 400.
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ message: "ID inválido." });
  }

  Vendedor.getById(Number(id), (err, vendedor) => {
    if (err) {
      console.error(`Erro ao buscar vendedor com id ${id}:`, err);
      return res.status(500).json({ message: "Erro no servidor." });
    }

    if (!vendedor) {
      return res.status(404).json({ message: "Vendedor não encontrado." });
    }

    return res.status(200).json(vendedor);
  });
}

module.exports = {
  getAllVendedores,
  getVendedorDetails
};
