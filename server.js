const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const notifier = require('node-notifier');
const cors = require('cors');
const app = express();
const port = 5000;

// 1. Criar e conectar ao banco de dados (se ele não existir)
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite com sucesso.');
    // 2. Criar a tabela "itens" se ela não existir
    db.run(
      `
      CREATE TABLE IF NOT EXISTS itens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        valor REAL,
        descricao TEXT,
        prazo DATETIME
      )`, // Tipo de dado da coluna prazo alterado para DATETIME
      (err) => {
        if (err) {
          console.error('Erro ao criar a tabela "itens":', err.message);
        } else {
          console.log('Tabela "itens" criada com sucesso.');
        }
      }
    );
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/itens', (req, res) => {
  db.all('SELECT * FROM itens', (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

app.post('/itens', (req, res) => {
  const { nome, valor, descricao, prazo } = req.body;
  db.run(
    'INSERT INTO itens (nome, valor, descricao, prazo) VALUES (?, ?, ?, ?)',
    [nome, valor, descricao, prazo],
    function (err) {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json({
          id: this.lastID,
          nome,
          valor,
          descricao,
          prazo,
        });
      }
    }
  );
});

app.put('/itens/:id', (req, res) => {
  const itemId = req.params.id;
  const { nome, valor, descricao, prazo } = req.body;
  db.run(
    'UPDATE itens SET nome = ?, valor = ?, descricao = ?, prazo = ? WHERE id = ?',
    [nome, valor, descricao, prazo, itemId],
    function (err) {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json({
          id: itemId,
          nome,
          valor,
          descricao,
          prazo,
        });
      }
    }
  );
});

app.delete('/itens/:id', (req, res) => {
  const itemId = req.params.id;
  db.run('DELETE FROM itens WHERE id = ?', itemId, function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json({ message: 'Item excluído com sucesso!' });
    }
  });
});

function verificarItensExpirados() {
  db.all(
    "SELECT * FROM itens WHERE prazo < datetime('now')", // Comparação com datetime('now')
    (err, rows) => {
      if (err) {
        console.error('Erro ao buscar itens expirados:', err);
      } else if (rows.length > 0) {
        rows.forEach((item) => {
          notifier.notify({
            title: 'Item Expirado!',
            message: `O item "${item.nome}" expirou!`,
          });
        });
      }
    }
  );
}

setInterval(verificarItensExpirados, 60000); // Verifica a cada minuto

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});