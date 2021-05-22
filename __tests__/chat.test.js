const app = require('../src/app');
const supertest = require('supertest');
const request = supertest(app);
const { Room } = require('../src/models')

let token = '';
let idRoom = 0;
let IdOwner = 0;

beforeAll(async (done) => {
    let signInUser = {
        email: 'degoprisss@gmail.com',
        password: 'diego'
    }

    let userSignIn = await request.post('/api/v1/signin').send(signInUser);

    token = userSignIn.body.token;
    console.log(token);

    done();
})


describe("Funcionalidad de las salas de chat", () => {
    it("Crear la sala de chat Vengadores", async (done) => {

        let room = {
            name: 'chat',
            screenname: 'chat',
            privat: false
        }

        let roomCreate = await request.post('/api/v1/rooms').send(room).set('authorization', token)

        idRoom = roomCreate.body.id;

        expect(roomCreate.status).toBe(201)
        expect(roomCreate.body).toHaveProperty('name', 'chat');
        expect(roomCreate.body).toHaveProperty('id');

        done()
    });


    it("Creación fallida de una sala de chat con el mismo nombre", async (done) => {

        let room = {
            name: 'familia',
            screenname: 'familia',
            privat: false
        }

        let roomCreate = await request.post('/api/v1/rooms').send(room).set('authorization', token)

        expect(roomCreate.body).toHaveProperty('message', 'Ya existe un registro con el mismo valor.')

        done()
    });

    it("Obtener las salas de chat", async (done) => {

        let getAllRooms = await request.get('/api/v1/rooms').set('authorization', token)

        expect(getAllRooms.status).toBe(200);

        done();

    });

    afterAll(async (dote) => {
        let deleteRoom = await request.delete(`/api/v1/rooms/${idRoom}`).set('authorization', token)
        dote();
    })

});


describe("Miembros de una sala de chat", () => {
    beforeAll(async (done) => {
        let room = {
            name: 'test',
            screenname: 'test',
            privat: false
        }

        let roomCreate = await request.post('/api/v1/rooms').send(room).set('authorization', token)

        idRoom = roomCreate.body.id;
        IdOwner = roomCreate.body.owner;
        console.log(IdOwner);
        console.log(idRoom);

        done();
    })

    it("Agregando 2 miembros a una sala de chat Vengadores", async (done) => {
        let membersAdd =  {
            members: [44, 45]
        };
 
        let resultAddMembers = await request.post(`/api/v1/rooms/${idRoom}/addMembers`).send(membersAdd).set('authorization', token);

        expect(resultAddMembers.status).toBe(201);
        // expect(typeof resultAddMembers.body).toBe("array");

        done();
    });

    // it("Obtener los miembros de la sala de chat Vengadores", () => {

    // });

    it("Petición fallida al tratar de agregar los mismos miembros a la sala Vengadores", async (done) => {
        let membersAdd =  {
            members: [44, 45]
        };
 
        let resultAddMembers = await request.post(`/api/v1/rooms/${idRoom}/addMembers`).send(membersAdd).set('authorization', token);

        expect(resultAddMembers.status).toBe(403);
        expect(resultAddMembers.body).toHaveProperty("message", "Ya existe un registro con el mismo valor.");

        done();
    });

    it("Eliminar los miembros de la sala de chat excepto el creador de la sala de chat", async (done) => {

        let membersAdd =  {
            members: [44, 45]
        };

        
        let resultAddMembers = await request.delete(`/api/v1/rooms/${idRoom}/members`).send(membersAdd).set('authorization', token);

        expect(resultAddMembers.status).toBe(200);
        expect(resultAddMembers.body).toHaveProperty("message", "The members have been removed");

        done();

    });

    it("Petición fallida al tratar de eliminar al creador de la sala Vengadores", async (done) => {

        let membersAdd =  {
            members: [IdOwner]
        };

        let resultAddMembers = await request.delete(`/api/v1/rooms/${idRoom}/members`).send(membersAdd).set('authorization', token);

        expect(resultAddMembers.status).toBe(400);
        expect(resultAddMembers.body).toHaveProperty("message", "The members have not been removed");

        done();
    });

    it("Volver a agregar los 2 miembros a la sala de chat Vengadores", async (done) => {

        let membersAdd =  {
            members: [44, 45]
        };
 
        let resultAddMembers = await request.post(`/api/v1/rooms/${idRoom}/addMembers`).send(membersAdd).set('authorization', token);

        expect(resultAddMembers.status).toBe(201);
        // expect(typeof resultAddMembers.body).toBe("array");

        done();

    });

    afterAll(async (dote) => {
        let deleteRoom = await request.delete(`/api/v1/rooms/${idRoom}`).set('authorization', token)
        dote();
    })

});

describe("Envio de mensajes en la sala de chat Avengers", () => {
    beforeAll(async (done) => {
        let room = {
            name: 'test2',
            screenname: 'test2',
            privat: false
        }

        let roomCreate = await request.post('/api/v1/rooms').send(room).set('authorization', token)

        idRoom = roomCreate.body.id;
        IdOwner = roomCreate.body.owner;
        console.log(IdOwner);
        console.log(idRoom);

        let membersAdd =  {
            members: [44, 45]
        };

        let resultAddMembers = await request.post(`/api/v1/rooms/${idRoom}/addMembers`).send(membersAdd).set('authorization', token);

        done();
    })

    it("Envio de mensaje por el administrador de la sala", async (done) => {

        let shippingMessage = {
            text: 'Nuestro  primer mensaje'
        }

        let messageResult = await request.post(`/api/v1/rooms/${idRoom}/sendMessage`).send(shippingMessage).set('authorization', token);
        
        expect(messageResult.status).toBe(201);

        done();
    });

    // it("Envío de mensaje por otro miembro de la sala", () => {

    // });

    it("Envío fallido de un mensaje por parte de usuario que no pertenezca a la sala", async (done) => {
        let shippingMessage = {
            text: 'Nuestro  primer mensaje'
        }

        let messageResult = await request.post(`/api/v1/rooms/${idRoom}/sendMessage`).send(shippingMessage);
        
        expect(messageResult.status).toBe(401);

        done();
    });

    afterAll(async (done) => {
        let deleteRoom = await request.delete(`/api/v1/rooms/${idRoom}`).set('authorization', token)
        done();
    })

});

//Usar la función beforeAll para poder iniciar sesión y guardar token
//Usar la función beforeAll para poder registrar 2 usuarios antes de las pruebas sobre el set "Miembros de una sala de chat"