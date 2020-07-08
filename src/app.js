const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkRepositoryExist (request, response, next) {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);
      if (!repository){        
      return response.status(400).json({error: 'Repository not found'});
  
  }
  return next();
}

//Listar
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

//Cadastra
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title, 
    url,
    techs, 
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

//Atualizar
app.put("/repositories/:id", checkRepositoryExist, (request, response) => {
  const { title, url, techs} = request.body;
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id == id);

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

//Deletar
app.delete("/repositories/:id", checkRepositoryExist, (request, response) => {
  const { id } = request.params;

  const Index = repositories.findIndex(repository => repository.id == id);
  repositories.splice(Index, 1);

  return response.json(repositories, 
        response.status(204).json({error: 'No Content'}));
});

//Incrementar like
app.post("/repositories/:id/like", checkRepositoryExist, (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id);
  
  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
