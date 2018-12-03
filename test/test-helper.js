const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../server')
process.env.NODE_ENV = 'test'

before(done => {
    console.log("Mongoose is connected to test Atlas remote DB")
    mongoose.connect("mongodb+srv://admin:admin123@studdit-ggmur.mongodb.net/test?retryWrites=true", { useNewUrlParser: true } );
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
    users.drop(() => {
        done()
    })
})
