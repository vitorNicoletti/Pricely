
const Pedido = require('../models/pedido.model');
const Promocao = require('../models/promocao.model');
const Usuario = require('../models/usuario.model');
const Vendedor = require('../models/vendedor.model');
const bcrypt = require('bcrypt');
const Compra = require('../models/compra.model');
const Conjunto = require('../models/conjunto.model');
const db = require('../db.js');



async function removerProduto(req, res) {
  const user = req.user;
  const { id_produto } = req.body || {};

  if (!user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  if (!id_produto) {
    return res.status(400).json({ error: 'Parâmetro id_produto é obrigatório' });
  }

  try {
    let carrinhoData = await Pedido.getCarrinhoPorIdVendedor(user.id_usuario);  
    carrinhoData = carrinhoData[0]
    if (!carrinhoData || !carrinhoData.compras || !carrinhoData.compras.length) {
      return res.status(404).json({ error: 'Carrinho vazio ou inexistente' });
    }

    for (const compra of carrinhoData.compras) {
      if (compra.id_produto === Number(id_produto)) {
        const sucesso = await Compra.removerCompra(compra.id_compra);

        if (sucesso) {
          return res.status(200).json({ message: 'Produto removido do carrinho com sucesso' });
        } else {
          return res.status(500).json({ error: 'Erro ao remover o produto do carrinho' });
        }
      }
    }

    return res.status(404).json({ error: 'Produto não encontrado no carrinho' });
  } catch (err) {
    console.error('Erro ao remover produto do carrinho:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

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
    carrinhoData = carrinhoData[0]
    if (!carrinhoData || carrinhoData.length === 0) {
      carrinhoData = await Pedido.createCarrinho(user.id_usuario);
    }
    const carrinhoId = carrinhoData?.pedido?.id_pedido || carrinhoData?.carrinho?.id_pedido;
    if(carrinhoData.compras){
      for (const compra of carrinhoData.compras) {
        if (compra.id_produto === id_produto) {
          
          await Compra.atualizarCompra(compra.id_compra,{
            quantidade: Number(compra.quantidade) + Number(quantidade)
          });
          return res.status(200).json({
            message: "produto adicionado com sucesso!",
            id_compra: compra.id_compra
          });
        }
      }

    }

    
    const idCompra = await Pedido.addProduto(carrinhoId, id_produto, quantidade, Number(dividir));
    if (!idCompra) {
      return res.status(500).json({ message: "Erro interno ao adicionar produto" });
    }

    return res.status(200).json({ message: "produto adicionado com sucesso!", id_compra: idCompra });

  } catch (err) {
    console.error('Erro ao adicionar produto ao carrinho:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}


async function obterCoordenadasPorEndereco(rua, numero) {
  const endereco = encodeURIComponent(`${rua}, ${numero}`);
  const url = `https://nominatim.openstreetmap.org/search?street=${endereco}&format=json&addressdetails=1&limit=1`;
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'SeuAppNode/1.0 (seuemail@exemplo.com)' } // Nominatim exige um User-Agent
    });
    const data = await response.json();
    if (data.length === 0) return null;

    const { lat, lon } = data[0];
    return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
  } catch (error) {
    console.error('Erro ao obter coordenadas:', error);
    return null;
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
async function finalizarCompra(req, res) {
  const user = req.user;
  const {
    senha: senhaConfirmacao,
    rua,
    numero,
    complemento
  } = req.body;

  // 1) Autenticação
  if (!user) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  // 2) Validação de entrada
  const erros = [];
  if (!senhaConfirmacao || typeof senhaConfirmacao !== "string" || !senhaConfirmacao.trim()) {
    erros.push("Senha é obrigatória.");
  }
  if (!rua || typeof rua !== "string" || !rua.trim()) {
    erros.push("Rua é obrigatória.");
  }
  const numeroInt = Number(numero);
  if (!numero || !Number.isInteger(numeroInt) || numeroInt <= 0) {
    erros.push("Número do endereço deve ser inteiro positivo.");
  }
  if (erros.length) {
    return res.status(400).json({ message: "Parâmetros inválidos.", detalhes: erros });
  }

  try {
    // 3) Verifica senha
    const [userBanco] = await Usuario.getUserByEmail(user.email);
    const senhaCorreta = await bcrypt.compare(senhaConfirmacao, userBanco.senha);
    if (!senhaCorreta) {
      return res.status(400).json({ message: "Senha incorreta." });
    }

    // 4) Busca carrinho
    let carrinhoData = await Pedido.getCarrinhoPorIdVendedor(user.id_usuario);
    carrinhoData = carrinhoData[0]
    if (!carrinhoData || !Array.isArray(carrinhoData.compras) || !carrinhoData.compras.length) {
      return res.status(400).json({ message: "Carrinho vazio ou inexistente." });
    }

    // 5) Geocodificação do endereço
    const coords = await obterCoordenadasPorEndereco(rua, numeroInt);
    if (!coords) {
      return res.status(502).json({ message: "Serviço de mapa indisponível ou endereço não encontrado." });
    }
    const { latitude: latCentro, longitude: lonCentro } = coords;

    // 6) Processa cada compra
    for (const compra of carrinhoData.compras) {
      const dadosAtualizacao = { estado: 'PAGO' };

      if (Number(compra.dividir) === 1) {
        // busca ou cria conjunto
        const conjuntosValidos = await Conjunto.buscarPorLocalEIdProduto(lonCentro, latCentro, compra.id_produto);
        let idConjunto;
        if (Array.isArray(conjuntosValidos) && conjuntosValidos.length) {
          idConjunto = conjuntosValidos[0].id_conjunto;
        } else {
          idConjunto = await Conjunto.criarConjunto(lonCentro, latCentro);
        }
        dadosAtualizacao.id_conjunto = idConjunto;
      }

      const okCompra = await Compra.atualizarCompra(compra.id_compra, dadosAtualizacao);
      if (!okCompra) {
        console.error(`Falha ao atualizar compra ${compra.id_compra}`);
      }
    }

    // 7) Atualiza dados e estado do pedido
    const dadosPedido = {
      estado: 'PAGO',
      rua,
      numero: numeroInt,
      complemento: complemento || null
    };
    const okPedido = await Pedido.atualizarPedido(carrinhoData.pedido.id_pedido, dadosPedido);
    if (!okPedido) {
      console.error(`Falha ao atualizar pedido ${carrinhoData.carrinho.id_pedido}`);
    }

    return res.status(200).json({ message: "Compra finalizada com sucesso." });

  } catch (error) {
    console.error("Erro ao finalizar compra:", error);
    return res.status(500).json({ message: "Erro interno ao finalizar compra." });
  }
}

async function obterCoordenadasPorEndereco(rua, numero) {
  const endereco = encodeURIComponent(`${rua}, ${numero}`);
  const url = `https://nominatim.openstreetmap.org/search?street=${endereco}&format=json&limit=1`;
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'SeuAppNode/1.0' } });
    const data = await response.json();
    if (!data.length) return null;
    return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
  } catch (err) {
    console.error('Erro ao obter coordenadas:', err);
    return null;
  }
}


function dividirCompra(compra){
  
}
module.exports = { getCarrinho, adicionarAoCarrinho, finalizarCompra,removerProduto };
