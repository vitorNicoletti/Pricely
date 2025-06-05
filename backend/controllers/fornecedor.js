const Fornecedor = require("../models/fornecedor.model.js");

function getFornecedorDetails(req, res) {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ message: "ID inválido." });
  }

  Fornecedor.getById(Number(id), (err, fornecedor) => {
    if (err) {
      console.error(`Erro ao buscar fornecedor com id ${id}:`, err);
      return res.status(500).json({ message: "Erro no servidor." });
    }

    if (!fornecedor) {
      return res.status(404).json({ message: "Fornecedor não encontrado." });
    }

    return res.status(200).json(fornecedor);
  });
}

module.exports = {
  getFornecedorDetails
};
