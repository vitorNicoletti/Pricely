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
  const { id_produto, quantidade, dividir } = req.body;

  // Verifica se usuário está autenticado
  if (!user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  // Validação dos campos
  const erros = [];

  if (!Number.isInteger(Number(id_produto)) || Number(id_produto) <= 0) {
    erros.push('id_produto deve ser um número inteiro positivo.');
  }

  if (!Number.isInteger(Number(quantidade)) || Number(quantidade) <= 0) {
    erros.push('quantidade deve ser um número inteiro positivo.');
  }

  if (Number(dividir) !== 0 && Number(dividir) !== 1) {
    erros.push('dividir deve ser 0 ou 1.');
  }

  if (erros.length > 0) {
    return res.status(400).json({ error: 'Parâmetros inválidos', detalhes: erros });
  }

  if (dividir === "0"){
    // processo de verificar se o pedido mínimo foi atendido e pegar possiveis descontos
    const infoPromocoes = await Promocao.getPromocoesByProduct(id_produto)
    const promocaoMinima = pegarPromocaoPedidoMinimo(res,infoPromocoes)
    if(promocaoMinima.quantidade > quantidade){
      dividir = 1
    }
  }

  if (!user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }
  
  try {
    // Supondo que o método no model se chame getCarrinhoPorIdVendedor
    let carrinhoId = -1
    let carrinhoData = await Pedido.getCarrinhoPorIdVendedor(user.id_usuario);
    
    if (carrinhoData) {
      carrinhoId = carrinhoData.id_pedido
      
    }
    else{
      carrinhoData = await Pedido.createCarrinho(user.id_usuario)
      
    }
 
    const idCompra = await Pedido.addProduto(carrinhoData.carrinho.id_pedido,id_produto,quantidade);
    if (!idCompra){
      return res.status(500).json({message:"internal server error"})
    }
    return res.status(200).json({message:"produto adicionado com sucesso!",id_compra:idCompra})
  } 
  catch (err) {
    console.error('Erro ao buscar carrinho:', err);
    return res.status(500).json({ error: 'idCompraErro interno no servidor' });
  }
}

function pegarPromocaoPedidoMinimo(res,listaPromocoes){
      const VALOR_ALTO_PARA_INICIAR_LOOP = 99999
    promocaoMinima = {
      quantidade: VALOR_ALTO_PARA_INICIAR_LOOP
    }
    for (promocao in listaPromocoes){
      if(promocao.quantidade < promocaoMinima.quantidade){
        promocaoMinima = promocao
      }
      else if (promocao.quantidade == promocaoMinima.quantidade){
        if(promocao.desc_porcentagem> promocaoMinima.desc_porcentagem){
          promocaoMinima = promocao
        }
      }
    }
    if (promocaoMinima.quantidade === VALOR_ALTO_PARA_INICIAR_LOOP){
      return res.status(404).json({message:"produto não está mais a venda"})
    }
  return promocaoMinima
}
module.exports = { getCarrinho, adicionarAoCarrinho };

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