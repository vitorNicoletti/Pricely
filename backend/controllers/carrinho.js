
const Pedido = require('../models/pedido.model');
const Promocao = require('../models/promocao.model');
const Usuario = require('../models/usuario.model');
const Vendedor = require('../models/vendedor.model');
const bcrypt = require('bcrypt');

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

async function adicionarAoCarrinho(req, res) {
  const user = req.user;


  let { id_produto, quantidade, dividir } = req.body;

  // Verifica se usuário está autenticado
  if (!user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  // Validação dos campos
  const erros = [];



  id_produto = Number(id_produto);
  quantidade = Number(quantidade);
  dividir = Number(dividir);

  if (!Number.isInteger(id_produto) || id_produto <= 0) {
    erros.push('id_produto deve ser um número inteiro positivo.');
  }

  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    erros.push('quantidade deve ser um número inteiro positivo.');
  }

  if (dividir !== 0 && dividir !== 1) {
    erros.push('dividir deve ser 0 ou 1.');
  }

  if (erros.length > 0) {
    return res.status(400).json({ error: 'Parâmetros inválidos', detalhes: erros });
  }
  // Verifica promoções se não for dividido
  if (dividir === 0) {
    const infoPromocoes = await Promocao.getPromocoesByProduct(id_produto);
    const promocaoMinima = pegarPromocaoPedidoMinimo(res, infoPromocoes);
    if (promocaoMinima.quantidade > quantidade) {
      dividir = 1;
    }
  }

  try {
    let carrinhoData = await Pedido.getCarrinhoPorIdVendedor(user.id_usuario);
    
    if (!carrinhoData) {
      carrinhoData = await Pedido.createCarrinho(user.id_usuario);
    }

    const carrinhoId = carrinhoData.carrinho?.id_pedido || carrinhoData.id_pedido;

    for (const compra of carrinhoData.compras) {
      if (compra.id_produto == id_produto) {
        await Compra.atualizarCompra(compra.id_compra,{
          quantidade: Number(compra.quantidade) + Number(quantidade)
        });
        return res.status(200).json({
          message: "produto adicionado com sucesso!",
          id_compra: compra.id_compra
        });
      }
    }

    const idCompra = await Pedido.addProduto(carrinhoId, id_produto, quantidade);
    if (!idCompra) {
      return res.status(500).json({ message: "Erro interno ao adicionar produto" });
    }

    return res.status(200).json({ message: "produto adicionado com sucesso!", id_compra: idCompra });

  } catch (err) {
    console.error('Erro ao adicionar produto ao carrinho:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

function pegarPromocaoPedidoMinimo(res, listaPromocoes) {
  const VALOR_ALTO = 99999;
  let promocaoMinima = { quantidade: VALOR_ALTO };

  for (const promocao of listaPromocoes) {
    if (promocao.quantidade < promocaoMinima.quantidade) {
      promocaoMinima = promocao;
    } else if (promocao.quantidade === promocaoMinima.quantidade) {
      if (promocao.desc_porcentagem > promocaoMinima.desc_porcentagem) {
        promocaoMinima = promocao;
      }
    }
  }

  if (promocaoMinima.quantidade === VALOR_ALTO) {
    res.status(404).json({ message: "produto não está mais à venda" });
    throw new Error("Produto indisponível");
  }

  return promocaoMinima;
}
async function finalizarCompra(req,res){
  // forma de confirmar se a compra REALMENTE deve ser feita
  const confirmarSenha = req.senha 
  const user = req.user
  const userBanco = await Usuario.getUserByEmail(user.email)
  const senha = userBanco.senha
  const senhaCorreta = await bcrypt.compare(senha, confirmarSenha);
  if (!senhaCorreta){
    return res.status(400).json({message:"senha incorreta."})
  }
  // senha confirmada, comecar algoritmo
  // verificar se existe e armazenar o carrinho
  const carrinho = await Pedido.getCarrinhoPorIdVendedor(user.id_usuario)
  if (!carrinho){
    return res.status(400).json({message:"carrinho não existe"})
  }
  //
  for(const compra in carrinho.compras ){
    const infoPromocoes = await Promocao.getPromocoesByProduct(compra.id_produto)
    const promocaoMinima = pegarPromocaoPedidoMinimo(res,infoPromocoes)
    if(promocaoMinima.quantidade > compra.quantidade){
      const conjuntoDividir = dividirCompra(compra)
    }
  }
  
}

function dividirCompra(compra){
  
}
module.exports = { getCarrinho, adicionarAoCarrinho };
