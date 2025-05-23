SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS,       UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE,
    SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
              NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

DROP SCHEMA IF EXISTS `Pricely`;
CREATE SCHEMA IF NOT EXISTS `Pricely` DEFAULT CHARACTER SET utf8;
USE `Pricely`;

/* =======================================================================
   I ▸ PESSOAS / DADOS PESSOAIS
======================================================================= */

-- -----------------------------------------------------
-- Table `Pricely`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario`   INT           NOT NULL,
  `email`        VARCHAR(100)  NOT NULL,
  `senha`        VARCHAR(200)  NOT NULL,
  `salt`         VARCHAR(200),
  `dataCadastro` DATETIME      NOT NULL,
  `telefone`     VARCHAR(45),
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Pricely`.`vendedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vendedor` (
  `id_usuario` INT        NOT NULL,
  `cpfCnpj`    VARCHAR(14) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  CONSTRAINT `fk_vendedor_usuario`
    FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Pricely`.`fornecedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fornecedor` (
  `id_usuario`          INT          NOT NULL,
  `razao_social`        VARCHAR(200) NOT NULL,
  `nome_fantasia`       VARCHAR(200),
  `cnpj`                VARCHAR(14)  NOT NULL,
  `inscricao_estadual`  VARCHAR(45),
  `inscricao_municipal` VARCHAR(45),
  `logradouro`          VARCHAR(150) NOT NULL,
  `numero`              VARCHAR(10)  NOT NULL,
  `complemento`         VARCHAR(150),
  `rep_nome`            VARCHAR(200),
  `rep_cpf`             VARCHAR(12),
  `rep_telefone`        VARCHAR(15),
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `CNPJ_UNIQUE` (`cnpj`),
  CONSTRAINT `fk_fornecedor_usuario`
    FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Pricely`.`carteira`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `carteira` (
  `id_carteira`        INT            NOT NULL AUTO_INCREMENT,
  `id_usuario`         INT            NOT NULL,
  `saldo`              DECIMAL(15,2)  NOT NULL DEFAULT 0.00,
  `ultima_atualizacao` DATETIME       NOT NULL
                       DEFAULT CURRENT_TIMESTAMP
                       ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_carteira`),
  UNIQUE KEY `ux_carteira_usuario` (`id_usuario`),
  CONSTRAINT `fk_carteira_usuario`
    FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Pricely`.`info_bancaria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `info_bancaria` (
  `id_info_banco` INT           NOT NULL,
  `banco`         VARCHAR(100)  NOT NULL,
  `agencia`       VARCHAR(50)   NOT NULL,
  `conta`         VARCHAR(50)   NOT NULL,
  `tipo_conta`    VARCHAR(50)   NOT NULL,
  `pix`           VARCHAR(50),
  `id_user`       INT           NOT NULL,
  PRIMARY KEY (`id_info_banco`),
  KEY `idx_banco_user` (`id_user`),
  CONSTRAINT `fk_banco_user`
    FOREIGN KEY (`id_user`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB;


/* =======================================================================
   II ▸ FUNCIONALIDADES / NEGÓCIO
======================================================================= */

-- -----------------------------------------------------
-- Table `Pricely`.`avaliacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `avaliacao` (
  `id_avaliacao`    INT           NOT NULL,
  `texto_avaliacao` VARCHAR(500),
  `avaliacao`       TINYINT       NOT NULL,
  PRIMARY KEY (`id_avaliacao`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Pricely`.`conjunto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `conjunto` (
  `id_conjunto`  INT           NOT NULL,
  `frete_max`    DOUBLE,
  `raio_metros`  DOUBLE        NOT NULL,
  `longitude`    VARCHAR(100)  NOT NULL,
  `latitude`     VARCHAR(100)  NOT NULL,
  PRIMARY KEY (`id_conjunto`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Pricely`.`produto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `produto` (
  `id_produto`    INT           NOT NULL,
  `nome`          VARCHAR(300)  NOT NULL,
  `descricao`     VARCHAR(1000),
  `preco_unidade` DOUBLE        NOT NULL,
  `estado`        VARCHAR(50),
  `id_fornecedor` INT           NOT NULL,
  PRIMARY KEY (`id_produto`),
  KEY `idx_produto_fornecedor` (`id_fornecedor`),
  CONSTRAINT `fk_produto_fornecedor`
    FOREIGN KEY (`id_fornecedor`) REFERENCES `fornecedor` (`id_usuario`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Pricely`.`pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pedido` (
  `id_pedido`       INT        NOT NULL,
  `dataCadastro`    DATETIME   NOT NULL,
  `desconto`        INT        NOT NULL,
  `rua`             VARCHAR(150),
  `numero`          VARCHAR(10),
  `complemento`     VARCHAR(150),
  `cep`             VARCHAR(10) NOT NULL,
  `id_vendedor`     INT        NOT NULL,
  `metodo_pagamento` 
      ENUM('carteira','pix','cartao','boleto') 
      NOT NULL DEFAULT 'carteira',
  PRIMARY KEY (`id_pedido`),
  KEY `idx_pedido_vendedor` (`id_vendedor`),
  CONSTRAINT `fk_pedido_vendedor`
    FOREIGN KEY (`id_vendedor`) REFERENCES `vendedor` (`id_usuario`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Pricely`.`compra`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `compra` (
  `id_compra`               INT            NOT NULL,
  `preco_unidade`           DOUBLE         NOT NULL,
  `quantidade`              INT            NOT NULL,
  `frete_pago`              DOUBLE,
  `estado`                  VARCHAR(50),
  `id_produto`              INT            NOT NULL,
  `id_pedido`               INT            NOT NULL,
  `id_avaliacao_fornecedor` INT,
  `id_avaliacao_produto`    INT,
  `id_conjunto`             INT,
  PRIMARY KEY (`id_compra`),
  KEY `idx_compra_pedido`   (`id_pedido`),
  KEY `idx_compra_produto`  (`id_produto`),
  CONSTRAINT `fk_compra_pedido`
    FOREIGN KEY (`id_pedido`)   REFERENCES `pedido`  (`id_pedido`),
  CONSTRAINT `fk_compra_produto`
    FOREIGN KEY (`id_produto`)  REFERENCES `produto` (`id_produto`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Pricely`.`oferta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `oferta` (
  `id_oferta`    INT       NOT NULL,
  `dataCadastro` DATETIME NOT NULL,
  `id_fornecedor` INT      NOT NULL,
  PRIMARY KEY (`id_oferta`),
  KEY `idx_oferta_fornecedor` (`id_fornecedor`),
  CONSTRAINT `fk_oferta_fornecedor`
    FOREIGN KEY (`id_fornecedor`) REFERENCES `fornecedor` (`id_usuario`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Pricely`.`produto_oferta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `produto_oferta` (
  `id_oferta`  INT NOT NULL,
  `id_produto` INT NOT NULL,
  PRIMARY KEY (`id_oferta`,`id_produto`),
  CONSTRAINT `fk_po_oferta`
    FOREIGN KEY (`id_oferta`)  REFERENCES `oferta`  (`id_oferta`),
  CONSTRAINT `fk_po_produto`
    FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Pricely`.`grupo_promocao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `grupo_promocao` (
  `idgrupo_promocao` INT NOT NULL,
  `quantidade`       INT NOT NULL,
  `desc_porcentagem` INT NOT NULL,
  `id_oferta`        INT NOT NULL,
  PRIMARY KEY (`idgrupo_promocao`),
  KEY `idx_gp_oferta` (`id_oferta`),
  CONSTRAINT `fk_gp_oferta`
    FOREIGN KEY (`id_oferta`) REFERENCES `oferta` (`id_oferta`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Pricely`.`avaliacao_fornecedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `avaliacao_fornecedor` (
  `id_avaliacao`  INT NOT NULL,
  `id_fornecedor` INT NOT NULL,
  PRIMARY KEY (`id_avaliacao`),
  KEY `idx_av_fornecedor` (`id_fornecedor`),
  CONSTRAINT `fk_av_fornecedor_av`
    FOREIGN KEY (`id_avaliacao`)  REFERENCES `avaliacao` (`id_avaliacao`),
  CONSTRAINT `fk_av_fornecedor_forn`
    FOREIGN KEY (`id_fornecedor`) REFERENCES `fornecedor` (`id_usuario`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Pricely`.`avaliacao_produto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `avaliacao_produto` (
  `id_avaliacao` INT NOT NULL,
  `id_produto`   INT NOT NULL,
  PRIMARY KEY (`id_avaliacao`),
  KEY `idx_av_produto` (`id_produto`),
  CONSTRAINT `fk_av_produto_av`
    FOREIGN KEY (`id_avaliacao`) REFERENCES `avaliacao` (`id_avaliacao`),
  CONSTRAINT `fk_av_produto_prod`
    FOREIGN KEY (`id_produto`)   REFERENCES `produto`   (`id_produto`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Pricely`.`seguindo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `seguindo` (
  `id_usuario_seguidor` INT NOT NULL,
  `id_usuario_seguido`  INT NOT NULL,
  `dataCadastro`        DATETIME NOT NULL,
  PRIMARY KEY (`id_usuario_seguidor`,`id_usuario_seguido`),
  KEY `idx_seg_seguido` (`id_usuario_seguido`),
  CONSTRAINT `fk_seg_seguidor`
    FOREIGN KEY (`id_usuario_seguidor`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `fk_seg_seguido`
    FOREIGN KEY (`id_usuario_seguido`)  REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB;


/* =======================================================================
   TRIGGERS PARA VALIDAÇÃO DE PAGAMENTO EM PEDIDOS RACHADOS
======================================================================= */
DELIMITER $$

CREATE TRIGGER trg_pedido_before_insert
BEFORE INSERT ON pedido
FOR EACH ROW
BEGIN
  IF EXISTS (
       SELECT 1
         FROM compra
        WHERE id_pedido = NEW.id_pedido
          AND id_conjunto IS NOT NULL
     )
     AND NEW.metodo_pagamento <> 'carteira'
  THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Pedidos rachados só podem usar metodo_pagamento = carteira';
  END IF;
END$$

CREATE TRIGGER trg_pedido_before_update
BEFORE UPDATE ON pedido
FOR EACH ROW
BEGIN
  IF EXISTS (
       SELECT 1
         FROM compra
        WHERE id_pedido = OLD.id_pedido
          AND id_conjunto IS NOT NULL
     )
     AND NEW.metodo_pagamento <> 'carteira'
  THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Pedidos rachados só podem usar metodo_pagamento = carteira';
  END IF;
END$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;