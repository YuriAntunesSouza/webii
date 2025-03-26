
import express, { json } from 'express'

const app = express();
const port = 3000;


//Exercício 1
app.use(express.json());
app.get('/',(req, res) => {
    res.send("Bem vindo ao projeto!");
})

//Exercício 2
app.get('/exercicio2/:nome', (req, res)=>{
    const nome = req.params.nome;
    res.send(`Olá, ${nome}`);
})

//Exercicio 3
const FakeAuthMiddleware = (req, res, next) =>{
    const AuthToken = req.headers.authorization;
    const FakeToken = "123456";
    if(!AuthToken){
        return res.status(403).send("Token não enviado!");
    }
    if(AuthToken !== FakeToken){
        return res.status(401).send("Token inválido!");
    }
    console.log("Middleware funcionando");
    next();
}

app.get('/exercicio3', FakeAuthMiddleware, (req, res) =>{
    res.send("Bem vindo a aplicação");
});

//Exercício 4
const Items = [
    {id: 1, name: "notebook", price: 4000},
    {id: 2, name: "celular", price: 2000},
    {id: 3, name: "eclado", price: 150},
    {id: 4, name: "mouse", price: 90},
    {id: 5, name: "mesa", price: 500}, 
    {id: 6, name: "cadeira", price: 900}
];

app.get("/items", (req, res) =>{
    const { id, name, price} = req.query;
    let filteredItems = [...Items];
    if(id){
        filteredItems = filteredItems.filter(Item => Item.id);
    }
    res;json(filteredItems);
})









app.listen(port,()=>{
    console.log(`Servidor iniciado em http://localhost:${port}`);
});
