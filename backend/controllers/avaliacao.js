const Avaliacao_produto = require("../models/avaliacao_produto.model");
const Compra = require("../models/compra.model");
const Pedido = require("../models/pedido.model");

async function avaliarProduto(req, res) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  // 1) Extrair e validar parâmetros
  let { id_compra, avaliacao, texto_avaliacao, id_produto } = req.body;
  id_compra = Number(id_compra);
  const erros = [];

  if (!Number.isInteger(id_compra) || id_compra <= 0) {
    erros.push("id_compra deve ser um inteiro positivo.");
  }
  const estrelas = Number(avaliacao);
  if (!Number.isInteger(estrelas) || estrelas < 1 || estrelas > 5) {
    erros.push("avaliacao deve ser inteiro entre 1 e 5.");
  }
  if (typeof texto_avaliacao !== "string" || !texto_avaliacao.trim()) {
    erros.push("texto_avaliacao é obrigatório.");
  }
  const idProdutoInt = Number(id_produto);
  if (!Number.isInteger(idProdutoInt) || idProdutoInt <= 0) {
    erros.push("id_produto deve ser um inteiro positivo.");
  }

  if (erros.length > 0) {
    return res.status(400).json({ error: "Parâmetros inválidos", detalhes: erros });
  }

  try {
    // 2) Verificar se a compra existe
    const compra = await Compra.getById(id_compra);
    if (!compra) {
      return res.status(404).json({ error: "Compra não encontrada." });
    }

    // 3) Verificar se a compra pertence ao usuário (vendedor) logado
    //    Para isso, buscamos o pedido e comparamos id_vendedor
    const pedidoDetalhado = await Pedido.getPedidoPorId(compra.id_pedido,user.id_usuario);
    console.log(compra)
    if (!pedidoDetalhado || pedidoDetalhado.pedido.id_vendedor !== user.id_usuario) {
      return res.status(403).json({ error: "Você não tem permissão para avaliar esta compra." });
    }

    // 4) Criar avaliação
    const idAvaliacao = await Avaliacao_produto.createAvaliacao(
      id_compra,
      estrelas,
      texto_avaliacao.trim(),
      idProdutoInt,
      user.id_usuario
    );

    if (!idAvaliacao) {
      return res.status(500).json({ error: "Falha ao criar avaliação." });
    }

    return res.status(201).json({
      message: "Avaliação criada com sucesso.",
      id_avaliacao: idAvaliacao
    });

  } catch (err) {
    console.error("Erro ao processar avaliação:", err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}

module.exports = { avaliarProduto };
