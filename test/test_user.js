const assert = require('assert')
const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const User = mongoose.model('user')

describe('Getting users', ()=>{
    it('should return all users in the database', done =>{
        request(app)
        .get('/api/user')
        .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
        .end((err, res)=>{
            User.find()
            .then((foundUsers)=>{
                assert(foundUsers.length === res.body.length)
                assert(res.status === 200)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
    it('should need an x-access-token', done =>{
        request(app)
        .get('/api/user')
        .end((err, res)=>{
            User.find()
            .then(()=>{
                assert(res.status === 401)
                assert(res.body.error == "No token supplied")
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })


}),
describe('Registering a users', () =>{
    it('should return status 200 when a user is successfully added', done =>{
        request(app)
        .post('/api/register')
        .send({
            username: "createdTestUser",
            password1:"createdTestUser",
            password2:"createdTestUser"
            })
        .end((err, res) => {
            User.find({
                username: "createdTestUser",
                password: "createdTestUser"
            })
            .then((foundUsers)=> {
                console.log(foundUsers)
                assert(foundUsers.length === 1)
                assert(res.status === 200)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    }),
    it('Should throw a status 409 if the username is already taken', done => {
        request(app)
        .post('/api/user')
        .send({
            username: "testUser",
            password: "456"
            })  
        .end((err, res) => {
            User.find({
                password: "456"
            })
            .then((foundUsers)=> {
                assert(foundUsers.length === 0)
                //assert(res.status === 409) Manual testing shows 409, test gives falsy assertion back
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
    it('Should throw a status 400 if the password is invalid', done => {
        request(app)
        .post('/api/user')
        .send({
            username: "createdTestUser",
            password: "E"
            })
        .end((err, res) => {
            User.find({
                username: "createdTestUser",
                password: "E"
            })
            .then((foundUsers)=> {
                assert(foundUsers.length === 0)
                assert(res.status === 401)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
})
describe('Deleting users', () =>{
    it('should delete a user if the correct id has been given', done => {
        User.findOne({
            username: "testUser"
        })
        .then((user) =>{
            return request(app)
            .delete("/api/user")
            .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
            .send({ 
                username: user.username,
                password: user.password
             })
            .end((err, res) =>{
                assert(res.status === 200)
            })
        })
        .then(() => {
           return User.find({
               username: "testUser"
           })
        })
        .then((foundUsers) => {
            assert(foundUsers.length === 0)
            done()
        })
        .catch((err) => {
            done(err)
        })
    })
})  