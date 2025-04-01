import express, { json } from 'express';

const app = express();
const port = 3000;


app.use(express.json());

//Exercício 1
app.get('/', (req, res) => {
    res.send("Bem vindo ao projeto!");
});

//Exercício 2
app.get('/exercicio2/:nome', (req, res) => {
    const nome = req.params.nome;
    res.send(`Olá, ${nome}`);
});

//Exercício 3
const FakeAuthMiddleware = (req, res, next) => {
    const AuthToken = req.headers.authorization;
    const FakeToken = "123456";
    if (!AuthToken) {
        return res.status(403).send("Token não enviado!");
    }
    if (AuthToken !== FakeToken) {
        return res.status(401).send("Token inválido!");
    }
    console.log("Middleware funcionando");
    next();
};

app.get('/exercicio3', FakeAuthMiddleware, (req, res) => {
    res.send("Bem vindo a aplicação");
});

// Dados para Exercício 4 e 5
const Items = [
    {id: 1, name: "notebook", price: 4000},
    {id: 2, name: "celular", price: 2000},
    {id: 3, name: "teclado", price: 150},
    {id: 4, name: "mouse", price: 90},
    {id: 5, name: "mesa", price: 500}, 
    {id: 6, name: "cadeira", price: 900}
];

//Exercício 4
app.get("/items", (req, res, next) => {
    try {
        const { id, name, price, minPrice, maxPrice } = req.query;
        let filteredItems = [...Items];
        
        if (id) {
            filteredItems = filteredItems.filter(item => item.id === parseInt(id));
        }
        
        if (name) {
            filteredItems = filteredItems.filter(item => 
                item.name.toLowerCase().includes(name.toLowerCase())
            );
        }
        
        if (price) {
            filteredItems = filteredItems.filter(item => item.price === parseInt(price));
        }
        
        if (minPrice) {
            filteredItems = filteredItems.filter(item => item.price >= parseInt(minPrice));
        }
        
        if (maxPrice) {
            filteredItems = filteredItems.filter(item => item.price <= parseInt(maxPrice));
        }
        
        res.json(filteredItems);
    } catch (error) {
        next(error);
    }
});

//Exercício 5
app.post("/items", (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            const error = new Error("O corpo da requisição não pode estar vazio");
            error.statusCode = 400;
            throw error;
        }

        if (!req.body.name || !req.body.price) {
            const error = new Error("Os campos 'name' e 'price' são obrigatórios");
            error.statusCode = 400;
            throw error;
        }

        const newId = Items.length > 0 ? Math.max(...Items.map(item => item.id)) + 1 : 1;

        const newItem = {
            id: newId,
            name: req.body.name,
            price: Number(req.body.price)
        };

        Items.push(newItem);
        res.status(201).json(newItem);
    } catch (error) {
        next(error);
    }
});

//Exercício 6
const validateUserData = (req, res, next) => {
    try {
        const { name, email, age } = req.body;
        
        if (!name || !email) {
            const error = new Error("Campos obrigatórios faltando: name e email");
            error.statusCode = 400;
            throw error;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            const error = new Error("Formato de email inválido");
            error.statusCode = 400;
            error.details = { example: "usuario@dominio.com" };
            throw error;
        }

        if (age && (isNaN(age) || age < 0 || age > 120)) {
            const error = new Error("Idade inválida");
            error.statusCode = 400;
            error.details = { message: "Deve ser um número entre 0 e 120" };
            throw error;
        }

        next();
    } catch (error) {
        next(error);
    }
};

let users = [];

app.post('/users', validateUserData, (req, res, next) => {
    try {
        const newUser = {
            id: users.length + 1,
            ...req.body,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
});

app.get('/users', (req, res, next) => {
    try {
        res.json(users);
    } catch (error) {
        next(error);
    }
});

app.use((req, res, next) => {
    const error = new Error("Rota não encontrada");
    error.statusCode = 404;
    next(error);
});

//Exercício 7 
app.use((err, req, res, next) => {
    console.error('Erro capturado:', err);

    const statusCode = err.statusCode || 500;
    const response = {
        success: false,
        status: statusCode,
        message: err.message || 'Erro interno no servidor',
    };

    if (err.details) {
        response.details = err.details;
    }

    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
});

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});