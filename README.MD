
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

- **Rota:** `POST /api/v1/auth/register`

Registra um novo usuário.

Corpo da Solicitação:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

## Login de Usuário

- **Rota:** `POST /api/v1/auth/login`

Login no usuário.

Corpo da Solicitação:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Atualizar Usuário

- **Rota:** `PATCH /api/v1/auth/updateUser`
- **Descrição:** Atualiza informações do usuário, incluindo nome, sobrenome, email e localização. Esta rota requer autenticação. Por favor, forneça um token JWT válido no cabeçalho 'Authorization'.


#### Corpo da Solicitação

```json
{
  "name": "Novo Nome",
  "lastName": "Novo Sobrenome",
  "email": "novoemail@example.com",
  "location": "Nova Localização"
}
```

# Jobs

Esta seção descreve as rotas relacionadas a trabalhos (jobs) disponíveis na API.

## Obter Todos os Empregos

- **Rota:** `GET /api/v1/jobs`
- **Descrição:** Recupera uma lista de todos os empregos. Você pode filtrar e paginar os resultados.

#### Parâmetros da Solicitação

- `status` (opcional): Filtra empregos por status ('all', 'pending', 'declined', 'interview').
- `jobType` (opcional): Filtra empregos por tipo ('all' ou um tipo de emprego específico).
- `sort` (opcional): Ordena empregos por ('mais recentes', 'mais antigos', 'a-z', 'z-a').
- `search` (opcional): Pesquisa empregos por posição.
- `page` (opcional): Número da página para paginação.
- `limit` (opcional): Número de itens por página.

#### Respostas

- **200:** Lista de empregos com informações de paginação.
- **400:** Solicitação inválida. Parâmetros de consulta inválidos.
- **401:** Não autorizado. A autenticação falhou.

## Criar um Novo Emprego

- **Rota:** `POST /api/v1/jobs`
- **Descrição:** Cria uma nova postagem de emprego.

#### Corpo da Solicitação

```json
{
  "company": "Exemplo S.A.",
  "position": "Engenheiro de Software",
  "status": "pendente"
}
```

#### Respostas

- **201:** Emprego criado com sucesso.
- **400:** Solicitação inválida. Dados inválidos ou valores ausentes.
- **401:** Não autorizado. A autenticação falhou.


## Obter Estatísticas de Empregos

- **Rota:** `GET /api/v1/jobs/stats`
- **Descrição:** Recupera estatísticas sobre postagens de empregos.

#### Respostas

- **200:** Estatísticas de empregos.
- **401:** Não autorizado. A autenticação falhou.


## Obter um Emprego por ID

- **Rota:** `GET /api/v1/jobs/{id}`
- **Descrição:** Recupera um emprego por seu ID exclusivo.

**Parâmetros da Solicitação:**

- `id` (obrigatório): ID do emprego.

**Respostas:**

- **200:** Detalhes do emprego.
- **404:** Emprego não encontrado.
- **401:** Não autorizado. A autenticação falhou.

## Excluir um Emprego por ID

- **Rota:** `DELETE /api/v1/jobs/{id}`
- **Descrição:** Exclui um emprego por seu ID exclusivo.

**Parâmetros da Solicitação:**

- `id` (obrigatório): ID do emprego.

**Respostas:**

- **200:** Emprego excluído com sucesso.
- **404:** Emprego não encontrado.
- **401:** Não autorizado. A autenticação falhou.


## Atualizar um Emprego por ID

- **Rota:** `PATCH /api/v1/jobs/{id}`
- **Descrição:** Atualiza um emprego por seu ID exclusivo.

**Parâmetros da Solicitação:**

- `id` (obrigatório): ID do emprego.

**Corpo da Solicitação:**

```json
{
  "company": "Exemplo Atualizado S.A.",
  "position": "Engenheiro de Software Sênior",
  "status": "entrevista"
}
