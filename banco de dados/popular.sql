USE `Pricely`;

-- -----------------------------------------------------
-- Arquivos
-- -----------------------------------------------------
INSERT INTO `arquivos` (id, nome, tipo, dados) VALUES
  (1, 'perfil_alice.png', 'image/png', '<base64-perfil-alice>'),
  (2, 'doc_alice.pdf',    'application/pdf', '<base64-doc-alice>'),
  (3, 'produto100.jpg',   'image/jpeg', '<base64-produto100>');

-- -----------------------------------------------------
-- Usuários
-- -----------------------------------------------------
INSERT INTO `usuario` (
  email,
  senha,
  salt,
  dataCadastro,
  telefone,
  perfil_arquivo_id,
  documento_arquivo_id
) VALUES
  ('alice@example.com', 'hash1', 'salt1', '2025-01-10 09:15:00', '5511912340001', 1, 2),
  ('bob@example.com',   'hash2', 'salt2', '2025-02-20 14:30:00', '5521923450002', NULL, NULL),
  ('carol@example.com', 'hash3', 'salt3', '2025-03-15 11:45:00', NULL, NULL, NULL);


-- -----------------------------------------------------
-- Seguindo
-- -----------------------------------------------------
INSERT INTO `seguindo` (
  id_usuario_seguidor,
  id_usuario_seguido,
  dataCadastro
) VALUES
  (1, 2, '2025-02-21 10:00:00'),
  (1, 3, '2025-03-16 12:00:00'),
  (2, 3, '2025-03-17 09:30:00');

-- -----------------------------------------------------
-- Carteira
-- -----------------------------------------------------
INSERT INTO `carteira` (
  id_carteira,
  saldo,
  ultima_atualizacao,
  id_usuario
) VALUES
  (1, 1000.00, '2025-05-01 08:00:00', 1),
  (2,  250.50, '2025-05-02 09:15:00', 2),
  (3,   75.75, '2025-05-03 10:30:00', 3);

-- -----------------------------------------------------
-- Vendedor
-- -----------------------------------------------------
INSERT INTO `vendedor` (
  id_usuario,
  cpfCnpj
) VALUES
  (2, '12345678901'),
  (3, '10987654321');

-- -----------------------------------------------------
-- Fornecedor
-- -----------------------------------------------------
INSERT INTO `fornecedor` (
  id_usuario,
  razao_social,
  nome_fantasia,
  cnpj,
  inscricao_estadual,
  inscricao_municipal,
  logradouro,
  numero,
  complemento,
  rep_nome,
  rep_cpf,
  rep_telefone
) VALUES
  (1, 'Alpha Comércio Ltda',   'Alpha Store', '11122233000144',
     '1234567890', '0987654321', 'Rua A', '100', NULL,
     'Ana Silva', '11122233344', '551190000001'),
  (2, 'Beta Distribuidora SA', 'Beta Distrib', '55566677000188',
     '2233445566', '6655443322', 'Av. B', '200', 'Sala 5',
     'Bruno Lima', '55566677788', '552192000002');

-- -----------------------------------------------------
-- Pedido
-- -----------------------------------------------------
INSERT INTO `pedido` (
  id_pedido,
  dataCadastro,
  desconto,
  rua,
  numero,
  complemento,
  id_vendedor,
  cep,
  metodo_pagamento
) VALUES
  (100, '2025-05-05 10:00:00', 10, 'Rua A', '100', NULL, 2, '01000000', 'cartao'),
  (101, '2025-05-10 15:30:00',  0, 'Av. B', '200', 'Apto 5', 3, '20000000', 'pix');

-- -----------------------------------------------------
-- Produto
-- -----------------------------------------------------
INSERT INTO `produto` (
  id_produto,
  nome,
  descricao,
  preco_unidade,
  estado,
  id_fornecedor,
  imagem_arquivo_id
) VALUES
  (100, 'Smartphone X', 'Tela 6.5" , 128GB, câmera 12MP', 1999.90, 'novo', 1, 3),
  (101, 'Headphone Y', 'Bluetooth, noise-canceling',    499.50, 'novo', 1, NULL),
  (102, 'Teclado Z',   'Mecânico, RGB',                   299.00, 'novo', 2, NULL);

-- -----------------------------------------------------
-- Avaliacao
-- -----------------------------------------------------
INSERT INTO `avaliacao` (
  id_avaliacao,
  texto_avaliacao,
  avaliacao
) VALUES
  (1, 'Excelente produto!',    5),
  (2, 'Bom custo-benefício.',  4),
  (3, 'Entrega atrasada.',     2),
  (4, 'Qualidade razoável.',   3);

-- -----------------------------------------------------
-- Avaliacao_Fornecedor
-- -----------------------------------------------------
INSERT INTO `avaliacao_fornecedor` (
  id_avaliacao,
  id_fornecedor
) VALUES
  (1, 1),
  (3, 2);

-- -----------------------------------------------------
-- Avaliacao_Produto
-- -----------------------------------------------------
INSERT INTO `avaliacao_produto` (
  id_avaliacao,
  id_produto
) VALUES
  (2, 100),
  (4, 102);

-- -----------------------------------------------------
-- Conjunto
-- -----------------------------------------------------
INSERT INTO `conjunto` (
  id_conjunto,
  frete_max,
  raio_metros,
  longitude,
  latitude
) VALUES
  (1, 20.00, 5000, '-46.633309','-23.550520'),
  (2, 15.00, 3000, '-43.209373','-22.911014');

-- -----------------------------------------------------
-- Compra
-- -----------------------------------------------------
INSERT INTO `compra` (
  id_compra,
  preco_unidade,
  quantidade,
  frete_pago,
  estado,
  id_produto,
  id_pedido,
  id_avaliacao_fornecedor,
  id_avaliacao_produto,
  id_conjunto
) VALUES
  (500, 1999.90, 1, 20.00, 'entregue',    100, 100, 1, 2, 1),
  (501,  499.50, 2, 10.00, 'em_transito', 101, 100, NULL, NULL, 1),
  (502,  299.00, 1, 15.00, 'pendente',    102, 101, 3,    4, 2);

-- -----------------------------------------------------
-- Oferta
-- -----------------------------------------------------
INSERT INTO `oferta` (
  id_oferta,
  dataCadastro,
  id_fornecedor
) VALUES
  (10, '2025-04-01 08:00:00', 1),
  (11, '2025-04-15 09:15:00', 2);

-- -----------------------------------------------------
-- Produto_Oferta
-- -----------------------------------------------------
INSERT INTO `produto_oferta` (
  id_oferta,
  id_produto
) VALUES
  (10, 100),
  (10, 101),
  (11, 102);

-- -----------------------------------------------------
-- Grupo_Promocao
-- -----------------------------------------------------
INSERT INTO `grupo_promocao` (
  idgrupo_promocao,
  quantidade,
  desc_porcentagem,
  id_oferta
) VALUES
  (100, 2,  5, 10),
  (101, 3, 10, 11);

-- -----------------------------------------------------
-- Info_Bancaria
-- -----------------------------------------------------
INSERT INTO `info_bancaria` (
  id_info_banco,
  banco,
  agencia,
  conta,
  tipo_conta,
  pix,
  id_user
) VALUES
  (1, 'Banco A', '0001', '12345-6', 'corrente', 'alice@pix', 1),
  (2, 'Banco B', '0002', '65432-1', 'poupanca', NULL,        2);

-- -----------------------------------------------------
-- Restaura checks
-- -----------------------------------------------------
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;