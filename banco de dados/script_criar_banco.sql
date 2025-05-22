-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Pricely
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Pricely
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Pricely` DEFAULT CHARACTER SET utf8 ;
USE `Pricely` ;

-- -----------------------------------------------------
-- Table `Pricely`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`usuario` (
  `id_usuario` INT NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(200) NOT NULL,
  `salt` VARCHAR(200) NULL,
  `dataCadastro` DATETIME NOT NULL,
  `telefone` VARCHAR(45) NULL,
  PRIMARY KEY (`id_usuario`))
ENGINE = InnoDB;


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
    REFERENCES `Pricely`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_seguindo_2`
    FOREIGN KEY (`id_usuario_seguido`)
    REFERENCES `Pricely`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Pricely`.`vendedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`vendedor` (
  `id_usuario` INT NOT NULL,
  `cpfCnpj` VARCHAR(14) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  CONSTRAINT `fk_vendedor_1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `Pricely`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Pricely`.`fornecedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`fornecedor` (
  `id_usuario` INT NOT NULL,
  `razao_social` VARCHAR(200) NOT NULL,
  `nome_fantasia` VARCHAR(200) NULL,
  `cnpj` VARCHAR(11) NOT NULL,
  `inscricao_estadual` VARCHAR(45) NULL,
  `inscricao_municipal` VARCHAR(45) NULL,
  `logradouro` VARCHAR(150) NOT NULL,
  `numero` VARCHAR(10) NOT NULL,
  `complemento` VARCHAR(150) NULL,
  `banco` VARCHAR(200) NULL,
  `agencia` VARCHAR(45) NULL,
  `conta` VARCHAR(45) NULL,
  `tipo_conta` VARCHAR(45) NULL,
  `pix` VARCHAR(200) NULL,
  `rep_nome` VARCHAR(200) NULL,
  `rep_cpf` VARCHAR(12) NULL,
  `rep_telefone` VARCHAR(15) NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `CNPJ_UNIQUE` (`cnpj` ASC) VISIBLE,
  CONSTRAINT `fk_fornecedor_1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `Pricely`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Pricely`.`url_documento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`url_documento` (
  `id_doc` INT NOT NULL,
  `dataCadastro` DATETIME NOT NULL,
  `link` VARCHAR(200) NOT NULL,
  `id_fornecedor` INT NOT NULL,
  PRIMARY KEY (`id_doc`),
  INDEX `fk_url_documento_1_idx` (`id_fornecedor` ASC) VISIBLE,
  CONSTRAINT `fk_url_documento_1`
    FOREIGN KEY (`id_fornecedor`)
    REFERENCES `Pricely`.`fornecedor` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Pricely`.`pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`pedido` (
  `id_pedido` INT NOT NULL,
  `dataCadastro` DATETIME NOT NULL,
  `desconto` INT NOT NULL,
  `rua` VARCHAR(150) NULL,
  `numero` VARCHAR(10) NULL,
  `complemento` VARCHAR(150) NULL,
  `id_vendedor` INT NOT NULL,
  `cep` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`id_pedido`),
  INDEX `fk_pedido_1_idx` (`id_vendedor` ASC) VISIBLE,
  CONSTRAINT `fk_pedido_1`
    FOREIGN KEY (`id_vendedor`)
    REFERENCES `Pricely`.`vendedor` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Pricely`.`produto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`produto` (
  `id_produto` INT NOT NULL,
  `nome` VARCHAR(300) NOT NULL,
  `descricao` VARCHAR(1000) NULL,
  `preco_unidade` DOUBLE NOT NULL,
  `estado` VARCHAR(50) NULL,
  `id_fornecedor` INT NOT NULL,
  PRIMARY KEY (`id_produto`),
  INDEX `fk_produto_1_idx` (`id_fornecedor` ASC) VISIBLE,
  CONSTRAINT `fk_produto_1`
    FOREIGN KEY (`id_fornecedor`)
    REFERENCES `Pricely`.`fornecedor` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Pricely`.`avaliacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`avaliacao` (
  `id_avaliacao` INT NOT NULL,
  `texto_avaliacao` VARCHAR(500) NULL,
  `avaliacao` TINYINT NOT NULL,
  PRIMARY KEY (`id_avaliacao`))
ENGINE = InnoDB;


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
    REFERENCES `Pricely`.`avaliacao` (`id_avaliacao`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_fornecedor`
    FOREIGN KEY (`id_fornecedor`)
    REFERENCES `Pricely`.`fornecedor` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


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
    REFERENCES `Pricely`.`avaliacao` (`id_avaliacao`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_produto_aval`
    FOREIGN KEY (`id_produto`)
    REFERENCES `Pricely`.`produto` (`id_produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Pricely`.`conjunto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`conjunto` (
  `id_conjunto` INT NOT NULL,
  `frete_max` DOUBLE NULL,
  `raio_metros` DOUBLE NOT NULL,
  `longitude` VARCHAR(100) NOT NULL,
  `latitude` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_conjunto`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Pricely`.`compra`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`compra` (
  `id_compra` INT NOT NULL,
  `preco_unidade` DOUBLE NOT NULL,
  `quantidade` INT NOT NULL,
  `frete_pago` DOUBLE NULL,
  `estado` VARCHAR(50) NULL,
  `id_produto` INT NOT NULL,
  `id_pedido` INT NOT NULL,
  `id_avaliacao_fornecedor` INT NULL,
  `id_avaliacao_produto` INT NULL,
  `id_conjunto` INT NULL,
  PRIMARY KEY (`id_compra`),
  INDEX `fk_compra_1_idx` (`id_pedido` ASC) VISIBLE,
  INDEX `fk_compra_2_idx` (`id_produto` ASC) VISIBLE,
  INDEX `fk_aval_fornecedor_idx` (`id_avaliacao_fornecedor` ASC) VISIBLE,
  INDEX `fk_aval_produto_idx` (`id_avaliacao_produto` ASC) VISIBLE,
  INDEX `fk_conjunto_idx` (`id_conjunto` ASC) VISIBLE,
  CONSTRAINT `fk_compra_1`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `Pricely`.`pedido` (`id_pedido`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_compra_2`
    FOREIGN KEY (`id_produto`)
    REFERENCES `Pricely`.`produto` (`id_produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_aval_fornecedor`
    FOREIGN KEY (`id_avaliacao_fornecedor`)
    REFERENCES `Pricely`.`avaliacao_fornecedor` (`id_avaliacao`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_aval_produto`
    FOREIGN KEY (`id_avaliacao_produto`)
    REFERENCES `Pricely`.`avaliacao_produto` (`id_avaliacao`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_conjunto`
    FOREIGN KEY (`id_conjunto`)
    REFERENCES `Pricely`.`conjunto` (`id_conjunto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Pricely`.`oferta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`oferta` (
  `id_oferta` INT NOT NULL,
  `dataCadastro` DATETIME NOT NULL,
  `id_fornecedor` INT NOT NULL,
  PRIMARY KEY (`id_oferta`),
  INDEX `fk_oferta_fornecedor1_idx` (`id_fornecedor` ASC) VISIBLE,
  CONSTRAINT `fk_oferta_fornecedor1`
    FOREIGN KEY (`id_fornecedor`)
    REFERENCES `Pricely`.`fornecedor` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


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
    REFERENCES `Pricely`.`oferta` (`id_oferta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_produto`
    FOREIGN KEY (`id_produto`)
    REFERENCES `Pricely`.`produto` (`id_produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Pricely`.`grupo_promocao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pricely`.`grupo_promocao` (
  `idgrupo_promocao` INT NOT NULL,
  `quantidade` INT NOT NULL,
  `desc_porcentagem` INT NOT NULL,
  `id_oferta` INT NOT NULL,
  PRIMARY KEY (`idgrupo_promocao`),
  INDEX `fk_grupo_promocao_oferta1_idx` (`id_oferta` ASC) VISIBLE,
  CONSTRAINT `fk_gfk_oferta`
    FOREIGN KEY (`id_oferta`)
    REFERENCES `Pricely`.`oferta` (`id_oferta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
