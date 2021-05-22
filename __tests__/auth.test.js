// const app = require('./server');
const app = require('../src/app');
const supertest = require('supertest');
const request = supertest(app);
const { User } = require('../src/models')

let id = 0;
describe("Flujo de registro", () => {
    it("Registro exitoso de un usuario", async (done) => {
        let user = {
            firstname: 'Humberto', 
            lastname: 'Enrique', 
            screenname: 'humbeEnri', 
            email: 'hbawhnddddodi@gmail.com', 
            password: 'Enrique'
        }
        let createUsers = await request.post('/api/v1/signup').send(user);
        id = createUsers.body.id;
        console.log(id);

        console.log(createUsers.body);
        expect(createUsers.status).toBe(201);
        expect(createUsers.body).toHaveProperty('lastname', 'Enrique');
        expect(createUsers.body).toHaveProperty('id');

        done();
    });

    it("Registro fallido de un usuario con correo duplicado", async (done) => {
        let user = {
            firstname: 'Humberto', 
            lastname: 'Enrique', 
            screenname: 'humbeEnri', 
            email: 'melissa@gmail.com', 
            password: 'Enrique'
        }
        let createUsers = await request.post('/api/v1/signup').send(user);
      
        console.log(createUsers.body);
        expect(createUsers.status).toBe(409);
        expect(createUsers.body).toHaveProperty('message', 'User exists!');

        done();
    });

    it("Registro fallido de un usuario con campos vacios", async (done) => {

        let user = {
            firstname: '', 
            lastname: '', 
            screenname: 'humbeEnri', 
            email: 'humbEnrrraaar@gmail.com', 
            password: 'Enrique'
        }
        let createUsers = await request.post('/api/v1/signup').send(user);
      
        expect(createUsers.status).toBe(403);
        expect(createUsers.body).toHaveProperty('message', 'Validation Error');

        done();
    });

    afterAll(async () => {
        console.log(id);
        await User.destroy({where: {id: id}}) 
    })
});

describe("Flujo de inicio de sesión", () => {
    it("Inicio de sesión correcto", async (done) => {
        let signInUser = {
            email: 'degoprisss@gmail.com', 
            password: 'diego'
        }

        let userSignIn = await request.post('/api/v1/signin').send(signInUser);

        expect(userSignIn.status).toBe(200)
        expect(userSignIn.body.user).toHaveProperty('email', 'degoprisss@gmail.com');
        expect(userSignIn.body.user).toHaveProperty('id')

        done();
    });

    it("Inicio de sesión fallido con credenciales incorrectas", async (done) => {
        let signInUser = {
            email: 'melissa@gmail.com', 
            password: 'mel'
        }

        let userSignIn = await request.post('/api/v1/signin').send(signInUser);

        expect(userSignIn.status).toBe(403)
        expect(userSignIn.body).toHaveProperty('message',  "Wrong credentials");

        done();
    });

    it("Inicio de sesión fallido con campos vacios", async (done) => {
        let signInUser = {
            email: 'melissa@gmail.com', 
            password: ''
        }

        let userSignIn = await request.post('/api/v1/signin').send(signInUser);

        expect(userSignIn.status).toBe(403)
        expect(userSignIn.body).toHaveProperty('message',  "empty fields");

        done();
    });

    it("Inicio de sesión fallido de un usuario que no existe en el sistema", async (done) => {
        let signInUser = {
            email: 'melisa@gmail.com', 
            password: 'meli'
        }

        let userSignIn = await request.post('/api/v1/signin').send(signInUser);

        expect(userSignIn.status).toBe(403)
        expect(userSignIn.body).toHaveProperty('message',  "Wrong credentials");

        done();
    });
});

describe("Validación de token", () => {
    it("Token valido", async (done) => {
        let signInUser = {
            email: 'degoprisss@gmail.com', 
            password: 'diego'
        }

        let userSignIn = await request.post('/api/v1/signin').send(signInUser);

        expect(userSignIn.status).toBe(200)

        done();
    });

    it("Token invalido", async (done) => {
        let signInUser = {
            email: 'melissa@gmail.com', 
            password: 'mel'
        }

        let userSignIn = await request.post('/api/v1/signin').send(signInUser);

        expect(userSignIn.status).toBe(403)

        done();
    });
});