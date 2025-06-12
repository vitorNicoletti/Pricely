# Pricely

**Pricely** é uma aplicação para conectar microempreendedores a fornecedores de forma simples e eficiente.

## 📦 Pré-requisitos

- Node.js (v14 ou superior)
- MySQL
- NPM ou Yarn

## 🚀 Como rodar o projeto

### 1. Banco de Dados

- Crie o banco de dados no MySQL.
- Execute o script de criação localizado em:
  /'banco de dados'/script_criar_banco.sql
- Para popular rode o script
  /'banco de dados'/popular.sql

### 2. Backend

```bash
cd backend
npm install
npm start
```
#### 2.1 Criar o .env com os campos
```bash
PORT=3000
DB_USER=nome_usuario_bd
DB_PASSWORD=senha
DB_NAME=Pricely
JWT_SECRET=SECRETO
```
### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
