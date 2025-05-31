# Sistema de Gerenciamento de Veículos

Sistema para gerenciamento de veículos com funcionalidades de cadastro, edição, exclusão e controle de entrada/saída.

## 🚀 Funcionalidades

- Cadastro de veículos
- Edição de informações
- Exclusão de registros
- Controle de entrada/saída de veículos
- Histórico de movimentações
- Exportação de relatórios em PDF
- Filtro de busca
- Validações de campos

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)
- Git

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone [URL_DO_REPOSITORIO]
cd vehicle-manager
```

### 2. Backend

```bash
# Acesse a pasta do backend
cd vehicle-backend

# Instale as dependências
npm install

# Configure o banco de dados
# Crie um arquivo .env com as seguintes variáveis:
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=vehicle_manager

# Execute o script SQL para criar o banco de dados
# Acesse o MySQL e execute:
mysql -u seu_usuario -p < database.sql

# Inicie o servidor
npm start
```

O backend estará rodando em `http://localhost:3000`

### 3. Frontend

```bash
# Em outro terminal, acesse a pasta do frontend
cd vehicle-frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
# Se você tiver o Live Server instalado no VS Code, pode usá-lo
# Ou use um servidor HTTP simples como:
npx http-server
```

O frontend estará disponível em `http://localhost:8080` (ou a porta indicada pelo servidor HTTP)

## 🗄️ Estrutura do Banco de Dados

O sistema utiliza uma tabela principal:

```sql
CREATE TABLE veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(7) NOT NULL,
    chassi VARCHAR(17) NOT NULL,
    renavam VARCHAR(11) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    ano VARCHAR(4) NOT NULL,
    checkinDate DATETIME NOT NULL,
    checkoutDate DATETIME,
    UNIQUE KEY unique_placa (placa),
    UNIQUE KEY unique_chassi (chassi),
    UNIQUE KEY unique_renavam (renavam)
);
```

## 📦 Estrutura do Projeto

### Backend
```
vehicle-backend/
├── node_modules/
├── database.sql
├── db.js
├── index.js
├── package.json
└── .env
```

### Frontend
```
vehicle-frontend/
├── src/
│   ├── modules/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   └── main.js
├── css/
├── assets/
└── index.html
```

## 🔍 Validações

O sistema inclui validações para:
- Placa (formato ABC1234 ou ABC1D23)
- Chassi (17 caracteres alfanuméricos)
- Renavam (11 dígitos numéricos)
- Modelo (2-50 caracteres)
- Marca (2-50 caracteres)
- Ano (4 dígitos)

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

## ✨ Contribuindo

1. Faça o fork do projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request 