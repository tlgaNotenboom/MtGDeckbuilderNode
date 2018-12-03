const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../server')
process.env.NODE_ENV = 'test'

before(done => {
    console.log("Mongoose is connected to test Atlas remote DB")
    mongoose.connect("mongodb+srv://Admin:UJIv1hxtOlcMe0Tg@cluster0-md06d.azure.mongodb.net/test?retryWrites=true", { useNewUrlParser: true } );
    mongoose.connection
        .once('open', () => done())
        .on('error', err => {
            console.warn('Warning', err);
        });
});

beforeEach((done) => {
    const {
        users
    } = mongoose.connection.collections;
    const testUser = new User ({
        username: "testUser",
        password: "123"
    })
    .then(() =>{
        users.drop()
    })
    .then(() =>{
        testUser.save()
    })
    .then(() => done())
    .catch(() => done())
})
