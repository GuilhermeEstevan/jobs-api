
# API do Backend do Jobster


Esta é a API do backend para o site Jobster. Ela fornece vários pontos de extremidade para registro de usuário, autenticação, gerenciamento de cadastro de empregos e recuperação de estatísticas de empregos.

## Tabela de Conteúdo

- [Começando](#começando)
- [Autenticação](#autenticação)
- [Registro de Usuário](#registro-de-usuário)
- [Login de Usuário](#login-de-usuário)
- [Empregos](#empregos)
  - [Obter Todos os Empregos](#obter-todos-os-empregos)
  - [Criar um Novo Emprego](#criar-um-novo-emprego)
  - [Obter Estatísticas de Empregos](#obter-estatísticas-de-empregos)
  - [Obter um Emprego por ID](#obter-um-emprego-por-id)
  - [Excluir um Emprego por ID](#excluir-um-emprego-por-id)
  - [Atualizar um Emprego por ID](#atualizar-um-emprego-por-id)

## Começando

Para começar a usar a API do Backend do Jobster, siga estas etapas:

1. Clone este repositório em sua máquina local.
2. Instale as dependências necessárias usando `npm install`.
3. Configure suas variáveis de ambiente, incluindo detalhes de conexão com o banco de dados.
4. Inicie o servidor usando `npm start`.

O servidor estará em execução em `http://localhost:3000` por padrão.

## Autenticação

Todos os pontos de extremidade, exceto o registro de usuário e o login de usuário, requerem autenticação. Você precisa fornecer um token JWT válido no cabeçalho `Authorization` de suas solicitações.

## Registro de Usuário

### POST /api/v1/auth/register

Registra um novo usuário.

Corpo da Solicitação:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
