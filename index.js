const express = require('express');
const server = express();

server.use(express.json());//=>é necessário para que o express entenda o json dentro do corpo da requisição

//=>Array de utilizadores
  const users = ['José', 'Maria', 'Ana', 'Paulo', 'João'];
//=>Middleware=>permite manipular as informações da requisição
  //=>Middelware Global
  server.use((req, res, next)=>{
    console.time('Request');
    console.log(`Método: ${req.method}; URL: ${req.url}`);//=>Ótimo método para debug
    next();//=>next permite que as próximas rotas sejam executadas.
    console.timeEnd('Request');
  });
  //=>Middleware Local
  //=>É um Middleware que será aplicado diretamente nas rotas
  function checkUserExists(req, res, next){
    //=>Verifica se o nome do ulilizador foi enviado no corpo da requisição
    if(!req.body.name){
      return res.status(400).json({ error: 'O nome do utilizador não foi encontrado no corpo da requisição!'});
    }
    return next();
  }

  function checkArrayContainsUser(req, res , next){
    const user = users[req.params.index];
    //=>Verifica se o utilizador existe dentro do array    
    if(!user){
      return res.status(400).json( { error: 'Este utilizador não existe!' });
    }
    //=>Caso o utilizador existir cria uma nova variável dentro do req com o valor dentro da variável user
    req.user = user;

    return next();
  }

//=>Rotas 
  //=>Query params=http://localhost:3000/teste?nome=Rodrigo
  // server.get('/teste',(req, res)=>{
  //   const nome = req.query.nome;
  //   return res.json({message:`Hello ${nome}`});
  // });
  //  //=>Routes params=http://localhost:3000/users/1
  //  //=>Busca o utilizador de acordo com o index enviado como parâmetro 
  // server.get('/teste/:index', (req, res)=>{
  //   const {index}  = req.params;
  //   //=>Retorna o utilizador de dentro do array de acordo com o index 
  //   return res.json(`O utilizador ${users[index]} se encontra na posição ${index} do array!`);
  // });
//=>CRUD users
    //=>Rota para listar todos os utilizadores dentro do array => [users]
  server.get('/users',(req, res)=>{
    return res.json(users)
  });  
    //=>Rota para buscar um utilizador de acordo com o id, retorna somente o utilizador 
  server.get('/users/:index', checkArrayContainsUser, (req, res)=>{
    //const {index} = req.params;
    //return res.json(users[index]);
    //Visto Middleware checkArrayContainsUser retorna o utilizador dentro do req.user posso retornar diretamente : 
    return res.json(req.user);
  });
    //=>Rota para adicionar um utilizador
  server.post('/users/', checkUserExists, (req, res)=>{
    const { name }= req.body;//=>Recupera o nome inserido na variável
    users.push(name);
    return res.json(users);//=>Retorna a lista de todos os utilizadores atualizada
  });
    //=>Rota para alterar um utilizador 
  server.put('/users/:index', checkUserExists, checkArrayContainsUser, (req, res)=>{
    const { name } = req.body;//=>Recupera o novo nome para o utilizador dentro do corpo da requisição
    const { index } = req.params;//=>Recupera o index passado como parâmetro 
    users[index] = name;//=>Altera o utilizador que se encontra dentro do array na posição(index) passada pelo parâmetro
    return res.json(users)//=>Retorna a lista de utilizadores atualizada
  });
    //=>Rota para apagar um utilizador
  server.delete('/users/:index', checkArrayContainsUser, (req, res)=>{
    const { index } = req.params;//=>Recupera o index do utilizador a ser apagado
    users.splice(index, 1);//=>Apaga o utilizador do array de acordo com o index
    //=>return res.send('O utilizador foi apagado com sucesso!');//=>Retorna uma mensagem confirmando que o utilizador foi apagado
    return res.send();//=>Retorna uma mensagem confirmando que o utilizador foi apagado
  });  

server.listen(3000);//=>Porta onde o servidor é executado 