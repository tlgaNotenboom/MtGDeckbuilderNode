const assert = require('assert')
const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const User = mongoose.model('user')

describe('Creating users', () =>{
    it('should return status 200 when a user is successfully added', done =>{
        request(app)
        .post('/api/user')
        .send({
            username: "createdTestUser",
            password: "createdTestUser"
            })
        .end((err, res) => {
            User.find({
                username:"createdTestUser",
                password: "createdTestUser"
            })
            .then((foundUsers)=> {
                assert(foundUsers.length === 1)
                assert(res.status === 200)
                console.log(foundUsers.length)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
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
                assert(res.status === 409)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
});