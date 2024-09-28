# Projeto de Backend Para vaga de estagio da adasi

Este é um projeto de backend construído com Node.js, utilizando Prisma como ORM e Docker para gerenciar o banco de dados PostgreSQL.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript no lado do servidor.
- **Express**: Framework para construção de aplicações web em Node.js.
- **Prisma**: ORM (Object-Relational Mapping) para trabalhar com bancos de dados.
- **PostgreSQL**: Sistema de gerenciamento de banco de dados.
- **Docker**: Plataforma para desenvolvimento, envio e execução de aplicativos em contêineres.(Usado para subir o banco de dados sem muito esforço)

## Pré-requisitos

Antes de começar, você precisará ter os seguintes softwares instalados:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

## Configuração do Projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/alyssonrafael/selecao-node-adasi-2024
   cd selecao-node-adasi-2024

   ```
2. Instalar Dependências: execute no terminal o comando para instalar as dependências

   ```bash
   npm install
   ```
3. Após isso e garantir que você possui o Docker, você poderá executar o seguinte comando abaixo para subir o container com o banco de dados no Docker:

   ```bash
   docker-compose up -d
   ```
4. Renomeei o arquivo **.env.example** para **.env** para que o código possa usar as variáveis de ambiente. As variáveis já estão com os mesmos valores da criação do banco de dados. Por este ser um projeto que não vai para a produção, as configurações estão adequadas.
5. **Migrações**: Após o banco de dados estar em execução e o .env configurado, execute o seguinte comando para aplicar as migrações do Prisma:

   ```
   # Criar e aplicar migrações
   npx prisma migrate dev --name init
   # Gerar o cliente Prisma
   npx prisma generate
   ```
6. Depois desses ajustes execulte o comando abaixo para executar o servidor da aplicação

   ```
   npm run dev
   ```
