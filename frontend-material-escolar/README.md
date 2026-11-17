# Frontend - Cadastro de Material Escolar

Frontend em React + Vite para consumir a API do projeto Java Spring Boot.

## Requisitos
- Node.js instalado
- Backend Spring Boot iniciado na porta `8000`
- Banco PostgreSQL configurado conforme `application.properties` do backend

## Como executar
1. Abra esta pasta no VS Code.
2. Abra o terminal dentro da pasta.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o frontend:
   ```bash
   npm run dev
   ```
5. Abra no navegador o endereço mostrado pelo Vite (normalmente `http://localhost:5173`).

**Importante:** mantenha o backend Java em execução na porta `8000`. O Vite encaminha automaticamente as chamadas `/material-escolar` para `http://localhost:8000`, evitando a necessidade de configurar CORS para desenvolvimento local.

## Comunicação com o backend

A URL usada pelo frontend é `/material-escolar`. O proxy de desenvolvimento do Vite encaminha as requisições para o backend.

| Operação | Método HTTP | Endpoint |
|---|---|---|
| Listar todos | GET | `/material-escolar` |
| Buscar por ID | GET | `/material-escolar?id={id}` |
| Buscar por nome | GET | `/material-escolar?nome={nome}` |
| Cadastrar | POST | `/material-escolar` |
| Atualizar por ID | PUT | `/material-escolar?id={id}` |
| Excluir por ID | DELETE | `/material-escolar?id={id}` |
| Excluir por nome | DELETE | `/material-escolar?nome={nome}` |

O JSON enviado para cadastro e atualização usa os campos existentes na entidade `MaterialEscolar`:
```json
{
  "nome": "Caderno",
  "quantidade": 10,
  "preco": 12.5,
  "fornecedor": "Papelaria Central"
}
```

O ID é gerado pelo backend e não é enviado no cadastro.
