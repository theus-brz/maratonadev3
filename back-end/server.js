/* Configuração do servidor */
const express = require('express');
const server = express();

/* Configurar servidor para apresentar arquivos estáticos */
server.use(express.static('../front-end/public'));

/* Habilitar body do formulário */
server.use(express.urlencoded({ extended: true }));

/* Configurar a conexão com o banco de dados */
const Pool = require('pg').Pool;
const db = new Pool({
  user: 'postgres',
  password: '0000',
  host: 'localhost',
  port: 5432,
  database: 'doe',
});

/* Configurando o template engine */
const nunjucks = require('nunjucks');
nunjucks.configure('../front-end/', {
  express: server,
  noCache: true,
});

/* Lista de doadores: Vetor ou Array */
const donors = require('./entities/donors');

/* Configurar apresentação da página */
server.get('/', function(_, res) {
  db.query("SELECT * FROM donors", function(err, result) {
    if (err) return res.send("Erro de banco de dados");

    const donors = result.rows;
    return res.render('index.html', { donors });
  });
});

/* Resgatar dados do formulário */
server.post('/', function(req, res) {
  const { name, email, blood } = req.body;

  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios.");
  }

  const query = `
    INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3);
  `;

  const values = [name, email, blood];

  db.query(query, values, function(err) {
    if (err) return res.send("Erro no banco de dados.");

    return res.redirect("/");
  });
});

server.listen(3000, function() {
  console.log('servidor incializado.');
});
