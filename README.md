# 💻 AWS Node - Desafio 01 API

## Descrição
Esse projeto foi desenvolvido durante a trilha de Node.js do programa de bolsas da Compass UOL e tem como objetivo criar uma API simulando a solicitação de um cliente que desejava tal serviço para sua empresa, o projeto possui as rotas POST, GET, PATCH e DELETE e conta com diversas validações de dados.

## Como executar o projeto?

* Em seu repositório local crie uma cópia desse projeto em seu dispositivo utilizando no terminal o comando `git clone` https://github.com/RickM19/AWS-Node---Desafio-01
* Instale as dependências necessárias utilizando o comando `npm install`
* Configure a conexão do sequelize com o seu banco MySQL
- Execute a aplicação utilizando o comando  `npm start` paralelamente inicie o MySQL em sua máquina (SUGESTÃO: utilize o XAMPP para rodar o banco de dados em sua máquina).


## Tecnologias utilizadas

* Node.js
* NPM
* Express
* Sequelize
* MySQL

## Models

Nesse projeto temos a tabela cars que recebe os campos id, brand, model e year e a tabela car_items que recebe os campos id, name e carId pois está relacionada à tabela cars

## ROTAS DISPONIVEIS

### ROTA `POST /api/v1/cars`

Essa rota é responsável pela criação e inserção de carros no banco de dados

**CORPO DA REQUISIÇÃO**
```
{
  "brand": "string",
  "model": "string",
  "year": "integer",
  "items": ["array de strings"]
}
```

**Validações**
* Todos os campos são obrigatórios.
* O carro deve ter idade máxima de 10 anos.
* Não pode ser salvo carro já existente considerando marca modelo e ano.
* Não podem ser salvos items repetidos


### ROTA `GET /api/v1/cars/?queryparams`

essa rota é responsável pela consulta e resposta para o usuário dos itens consultados.
É possivel realizar a busca através de query params **?page=1&limit=2&brand=vol&model=gol&year=2015**


### ROTA `GET /api/v1/cars/:id`

essa rota é responsável pela consulta de um único carro através do seu ID.

### ROTA `PATCH /api/v1/cars/:id`

essa rota é responsável por atualizar um registro de carro no banco de dados através de seu ID, inclusive é possivel atualizar também os itens.

**CORPO DA REQUISIÇÃO**
```
{
  "brand": "string",
  "model": "string",
  "year": "integer",
  "items": ["array de strings"]
}
```

**Validações**
* Todos os campos são opcionais.
* As validações devem seguir as mesmas regras de cadastramento do carro.

### ROTA `DELETE /api/v1/cars/:id`

essa rota é responsável por excluir um registro de carro do banco de dados através do seu ID