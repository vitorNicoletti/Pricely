const Produtos = require("../models/produtos.model");

async function getProductDetails(req, res) {
  const { id } = req.params;

  // Valida ID
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ message: "ID inválido." });
  }

  try {
    const produto = await Produtos.getById(Number(id));
    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }
    res.status(200).json(produto);
  } catch (err) {
    console.error("Erro ao buscar produto:", err);
    return res.status(500).json({ message: "Erro no servidor." });
  }
}

function getAllProducts(req, res) {
  const { qnt } = req.body || { undefined };

  // Se quiser validar quantidade opcionalmente
  if (qnt !== undefined && isNaN(qnt)) {
    return res.status(400).json({ message: "Quantidade inválida." });
  }

  Produtos.getAll((err, results) => {
    if (err) {
      console.error("Erro ao buscar produtos:", err);
      return res.status(500).json({ message: "Erro no servidor." });
    }
    // Se quiser limitar resultados pela quantidade (caso qnt exista):
    const limited = qnt ? results.slice(0, Number(qnt)) : results;

    res.status(200).json(limited);
  });
}

module.exports = { getAllProducts, getProductDetails };
