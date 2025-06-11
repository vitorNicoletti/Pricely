DROP DATABASE IF EXISTS `Pricely`;

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema Pricely
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Pricely
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Pricely` DEFAULT CHARACTER SET utf8mb3 ;
USE `Pricely` ;

-- -----------------------------------------------------
-- Table `Pricely`.`arquivos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`arquivos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `tipo` VARCHAR(100) NOT NULL,
  `dados` LONGTEXT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `Pricely`.`avaliacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`avaliacao` (
  `id_avaliacao` INT NOT NULL AUTO_INCREMENT,
  `texto_avaliacao` VARCHAR(500) NULL DEFAULT NULL,
  `avaliacao` TINYINT NOT NULL,
  PRIMARY KEY (`id_avaliacao`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `Pricely`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(200) NOT NULL,
  `salt` VARCHAR(200) NULL DEFAULT NULL,
  `dataCadastro` DATETIME NOT NULL,
  `telefone` VARCHAR(45) NULL DEFAULT NULL,
  `perfil_arquivo_id` INT NULL DEFAULT NULL,
  `documento_arquivo_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  INDEX `fk_usuario_perfil_arquivo` (`perfil_arquivo_id` ASC) VISIBLE,
  INDEX `fk_usuario_documento_arquivo` (`documento_arquivo_id` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_documento_arquivo`
    FOREIGN KEY (`documento_arquivo_id`)
    REFERENCES `Pricely`.`arquivos` (`id`),
  CONSTRAINT `fk_usuario_perfil_arquivo`
    FOREIGN KEY (`perfil_arquivo_id`)
    REFERENCES `Pricely`.`arquivos` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 21
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `Pricely`.`fornecedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`fornecedor` (
  `id_usuario` INT NOT NULL,
  `razao_social` VARCHAR(200) NOT NULL,
  `nome_fantasia` VARCHAR(200) NULL DEFAULT NULL,
  `cnpj` VARCHAR(14) NOT NULL,
  `inscricao_estadual` VARCHAR(45) NULL DEFAULT NULL,
  `inscricao_municipal` VARCHAR(45) NULL DEFAULT NULL,
  `logradouro` VARCHAR(150) NOT NULL,
  `numero` VARCHAR(10) NOT NULL,
  `complemento` VARCHAR(150) NULL DEFAULT NULL,
  `rep_nome` VARCHAR(200) NULL DEFAULT NULL,
  `rep_cpf` VARCHAR(12) NULL DEFAULT NULL,
  `rep_telefone` VARCHAR(15) NULL DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `CNPJ_UNIQUE` (`cnpj` ASC) VISIBLE,
  CONSTRAINT `fk_fornecedor_1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `Pricely`.`usuario` (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

-- 10) Ofertas (fornecedor 2)
INSERT INTO oferta (id_oferta, dataCadastro, id_fornecedor) VALUES
  (1, '2025-05-01 08:00:00', 2);

-- 11) Grupo de promoção (oferta 1)
INSERT INTO grupo_promocao (idgrupo_promocao, quantidade, desc_porcentagem, id_oferta) VALUES
  (1, 3, 10, 1),  -- 10% de desconto para compras de 3 ou mais
  (2, 5, 20, 1);  -- 20% de desconto para compras de 5 ou mais
-- -----------------------------------------------------
-- Table `Pricely`.`avaliacao_fornecedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`avaliacao_fornecedor` (
  `id_avaliacao` INT NOT NULL,
  `id_fornecedor` INT NOT NULL,
  PRIMARY KEY (`id_avaliacao`),
  INDEX `fk_fornecedor_idx` (`id_fornecedor` ASC) VISIBLE,
  CONSTRAINT `fk_avaliacao`
    FOREIGN KEY (`id_avaliacao`)
    REFERENCES `Pricely`.`avaliacao` (`id_avaliacao`),
  CONSTRAINT `fk_fornecedor`
    FOREIGN KEY (`id_fornecedor`)
    REFERENCES `Pricely`.`fornecedor` (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `Pricely`.`produto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`produto` (
  `id_produto` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(300) NOT NULL,
  `descricao` VARCHAR(1000) NULL DEFAULT NULL,
  `preco_unidade` DOUBLE NOT NULL,
  `estado` VARCHAR(50) NULL DEFAULT NULL,
  `id_fornecedor` INT NOT NULL,
  `imagem_arquivo_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id_produto`),
  INDEX `fk_produto_fornecedor` (`id_fornecedor` ASC) VISIBLE,
  INDEX `fk_produto_imagem_arquivo` (`imagem_arquivo_id` ASC) VISIBLE,
  CONSTRAINT `fk_produto_fornecedor`
    FOREIGN KEY (`id_fornecedor`)
    REFERENCES `Pricely`.`fornecedor` (`id_usuario`),
  CONSTRAINT `fk_produto_imagem_arquivo`
    FOREIGN KEY (`imagem_arquivo_id`)
    REFERENCES `Pricely`.`arquivos` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- 12) Associação produto ↔ oferta
INSERT INTO produto_oferta (id_oferta, id_produto) VALUES
  (1, 1);

-- 13) Conjuntos de entrega
INSERT INTO conjunto (id_conjunto, frete_max, raio_metros, longitude, latitude) VALUES
  (1, 20.00, 5000, '-46.633309', '-23.55052');

-- -----------------------------------------------------
-- Table `Pricely`.`avaliacao_produto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`avaliacao_produto` (
  `id_avaliacao` INT NOT NULL,
  `id_produto` INT NOT NULL,
  PRIMARY KEY (`id_avaliacao`),
  INDEX `fk_produto_idx` (`id_produto` ASC) VISIBLE,
  CONSTRAINT `fk_avaliacao_p`
    FOREIGN KEY (`id_avaliacao`)
    REFERENCES `Pricely`.`avaliacao` (`id_avaliacao`),
  CONSTRAINT `fk_produto_aval`
    FOREIGN KEY (`id_produto`)
    REFERENCES `Pricely`.`produto` (`id_produto`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `Pricely`.`carteira`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`carteira` (
  `id_carteira` INT NOT NULL AUTO_INCREMENT,
  `saldo` DECIMAL(15,2) NOT NULL DEFAULT '0.00',
  `ultima_atualizacao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_carteira`),
  INDEX `idx_carteira_usuario` (`id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_carteira_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `Pricely`.`usuario` (`id_usuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `Pricely`.`vendedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`vendedor` (
  `id_usuario` INT NOT NULL,
  `cpfCnpj` VARCHAR(14) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  CONSTRAINT `fk_vendedor_1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `Pricely`.`usuario` (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `Pricely`.`pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`pedido` (
  `id_pedido` INT NOT NULL AUTO_INCREMENT,
  `dataCadastro` DATETIME NOT NULL,
  `desconto` INT NOT NULL,
  `rua` VARCHAR(150) NULL DEFAULT NULL,
  `numero` VARCHAR(10) NULL DEFAULT NULL,
  `complemento` VARCHAR(150) NULL DEFAULT NULL,
  `id_vendedor` INT NOT NULL,
  `cep` VARCHAR(10) NOT NULL,
  `metodo_pagamento` ENUM('carteira', 'pix', 'cartao', 'boleto') NOT NULL DEFAULT 'carteira',
  `estado` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id_pedido`),
  INDEX `fk_pedido_1_idx` (`id_vendedor` ASC) VISIBLE,
  CONSTRAINT `fk_pedido_1`
    FOREIGN KEY (`id_vendedor`)
    REFERENCES `Pricely`.`vendedor` (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

-- 14) Pedidos (vendedor 3)
INSERT INTO pedido (id_pedido, dataCadastro, desconto, rua, numero, complemento, id_vendedor, cep, metodo_pagamento, estado) VALUES
  (1, '2025-05-10 15:30:00', 0, 'Av. B', '200', 'Apto 5', 3, '20000000', 'cartao', 'CARRINHO');


-- 15) Compras no pedido 1
INSERT INTO compra (id_compra, preco_unidade, quantidade, frete_pago, estado, id_produto, id_pedido, id_avaliacao_fornecedor, id_avaliacao_produto, id_conjunto) VALUES
  (1, 49.90, 2, 15.00, 'PROCESSANDO', 1, 1, 1, 2, 1);
-- -----------------------------------------------------
-- Table `Pricely`.`conjunto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`conjunto` (
  `id_conjunto` INT NOT NULL AUTO_INCREMENT,
  `frete_max` DOUBLE NULL DEFAULT NULL,
  `raio_metros` DOUBLE NOT NULL,
  `longitude` VARCHAR(100) NOT NULL,
  `latitude` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_conjunto`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

-- 16) Informações bancárias do usuário 1
INSERT INTO info_bancaria (id_info_banco, banco, agencia, conta, tipo_conta, pix, id_user) VALUES
  (1, 'Banco do Brasil', '0001', '12345-6', 'Corrente', 'joao@pix.com', 1);

-- 17) Relacionamentos de seguimento (usuário 1 segue fornecedor 2 e vendedor 3)
INSERT INTO seguindo (id_usuario_seguidor, id_usuario_seguido, dataCadastro) VALUES
  (1, 2, '2025-04-20 12:00:00'),
  (1, 3, '2025-04-20 12:05:00');
-- -----------------------------------------------------
-- Table `Pricely`.`compra`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`compra` (
  `id_compra` INT NOT NULL AUTO_INCREMENT,
  `preco_unidade` DOUBLE NOT NULL,
  `quantidade` INT NOT NULL,
  `frete_pago` DOUBLE NULL DEFAULT NULL,
  `estado` VARCHAR(50) NULL DEFAULT NULL,
  `id_produto` INT NOT NULL,
  `id_pedido` INT NOT NULL,
  `id_avaliacao_fornecedor` INT NULL DEFAULT NULL,
  `id_avaliacao_produto` INT NULL DEFAULT NULL,
  `id_conjunto` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id_compra`),
  INDEX `fk_compra_1_idx` (`id_pedido` ASC) VISIBLE,
  INDEX `fk_compra_2_idx` (`id_produto` ASC) VISIBLE,
  INDEX `fk_aval_fornecedor_idx` (`id_avaliacao_fornecedor` ASC) VISIBLE,
  INDEX `fk_aval_produto_idx` (`id_avaliacao_produto` ASC) VISIBLE,
  INDEX `fk_conjunto_idx` (`id_conjunto` ASC) VISIBLE,
  CONSTRAINT `fk_aval_fornecedor`
    FOREIGN KEY (`id_avaliacao_fornecedor`)
    REFERENCES `Pricely`.`avaliacao_fornecedor` (`id_avaliacao`),
  CONSTRAINT `fk_aval_produto`
    FOREIGN KEY (`id_avaliacao_produto`)
    REFERENCES `Pricely`.`avaliacao_produto` (`id_avaliacao`),
  CONSTRAINT `fk_compra_1`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `Pricely`.`pedido` (`id_pedido`),
  CONSTRAINT `fk_compra_2`
    FOREIGN KEY (`id_produto`)
    REFERENCES `Pricely`.`produto` (`id_produto`),
  CONSTRAINT `fk_conjunto`
    FOREIGN KEY (`id_conjunto`)
    REFERENCES `Pricely`.`conjunto` (`id_conjunto`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `Pricely`.`oferta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`oferta` (
  `id_oferta` INT NOT NULL AUTO_INCREMENT,
  `dataCadastro` DATETIME NOT NULL,
  `id_fornecedor` INT NOT NULL,
  PRIMARY KEY (`id_oferta`),
  INDEX `fk_oferta_fornecedor1_idx` (`id_fornecedor` ASC) VISIBLE,
  CONSTRAINT `fk_oferta_fornecedor1`
    FOREIGN KEY (`id_fornecedor`)
    REFERENCES `Pricely`.`fornecedor` (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `Pricely`.`grupo_promocao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`grupo_promocao` (
  `idgrupo_promocao` INT NOT NULL AUTO_INCREMENT,
  `quantidade` INT NOT NULL,
  `desc_porcentagem` INT NOT NULL,
  `id_oferta` INT NOT NULL,
  PRIMARY KEY (`idgrupo_promocao`),
  INDEX `fk_grupo_promocao_oferta1_idx` (`id_oferta` ASC) VISIBLE,
  CONSTRAINT `fk_gfk_oferta`
    FOREIGN KEY (`id_oferta`)
    REFERENCES `Pricely`.`oferta` (`id_oferta`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `Pricely`.`info_bancaria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`info_bancaria` (
  `id_info_banco` INT NOT NULL AUTO_INCREMENT,
  `banco` VARCHAR(100) NOT NULL,
  `agencia` VARCHAR(50) NOT NULL,
  `conta` VARCHAR(50) NOT NULL,
  `tipo_conta` VARCHAR(50) NOT NULL,
  `pix` VARCHAR(50) NULL DEFAULT NULL,
  `id_user` INT NOT NULL,
  PRIMARY KEY (`id_info_banco`),
  INDEX `fk_banco_user_idx` (`id_user` ASC) VISIBLE,
  CONSTRAINT `fk_banco_user`
    FOREIGN KEY (`id_user`)
    REFERENCES `Pricely`.`usuario` (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `Pricely`.`produto_oferta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`produto_oferta` (
  `id_oferta` INT NOT NULL,
  `id_produto` INT NOT NULL,
  PRIMARY KEY (`id_oferta`, `id_produto`),
  INDEX `fk_produto_idx` (`id_produto` ASC) VISIBLE,
  CONSTRAINT `fk_oferta`
    FOREIGN KEY (`id_oferta`)
    REFERENCES `Pricely`.`oferta` (`id_oferta`),
  CONSTRAINT `fk_produto`
    FOREIGN KEY (`id_produto`)
    REFERENCES `Pricely`.`produto` (`id_produto`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `Pricely`.`seguindo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`seguindo` (
  `id_usuario_seguidor` INT NOT NULL,
  `id_usuario_seguido` INT NOT NULL,
  `dataCadastro` DATETIME NOT NULL,
  PRIMARY KEY (`id_usuario_seguidor`, `id_usuario_seguido`),
  INDEX `fk_seguindo_2_idx` (`id_usuario_seguido` ASC) VISIBLE,
  CONSTRAINT `fk_seguindo_1`
    FOREIGN KEY (`id_usuario_seguidor`)
    REFERENCES `Pricely`.`usuario` (`id_usuario`),
  CONSTRAINT `fk_seguindo_2`
    FOREIGN KEY (`id_usuario_seguido`)
    REFERENCES `Pricely`.`usuario` (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
