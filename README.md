Timer Itens
Timer Itens é uma aplicação web que permite aos usuários criar, visualizar, atualizar e excluir itens com um prazo de expiração. Quando um item expira, uma notificação do navegador é exibida.
Tecnologias Utilizadas

Frontend:

React.js
styled-components
axios
react-datepicker
moment.js


Backend:

Node.js
Express.js
SQLite



Estrutura do Projeto

public/:

index.html: Template HTML para a aplicação React.
Outros arquivos estáticos (favicon, manifest.json, etc.)


src/:

App.js: Componente principal da aplicação React.
index.js: Ponto de entrada da aplicação React.
components/:

AddItem.js: Formulário para adicionar novos itens.
Item.js: Componente para visualizar e manipular um item individual.
ItemList.js: Componente para renderizar a lista de itens.


styles/:

global.js: Estilos globais da aplicação.


alerta.png: Ícone usado nas notificações.


server.js: Servidor backend Express.js.
package.json: Configurações e dependências do projeto.
database.db: Banco de dados SQLite.

Funcionalidades

Criar Item: Adicione um novo item com nome, valor, descrição e prazo.
Listar Itens: Visualize todos os itens em tempo real.
Atualizar Item: Modifique os detalhes de um item existente.
Excluir Item: Remova um item da lista.
Countdown: Veja o tempo restante para cada item expirar.
Notificações: Receba uma notificação do navegador quando um item expirar.

Como Rodar o Projeto

Clone o repositório:
git clone https://github.com/seu-usuario/timer-itens.git
cd timer-itens

Instale as dependências:
npm install

Inicie o servidor backend e a aplicação React simultaneamente:
npm run dev

Acesse a aplicação em http://localhost:3000.

Rodando Frontend e Backend Separadamente
Se preferir rodar separadamente:

Inicie o servidor backend:
node server.js

Em um novo terminal, inicie a aplicação React:
npm start