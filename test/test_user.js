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
                assert(res.status === 409)
                assert(foundUsers.length === 0)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
    it('Should throw a status 412 if the password is invalid', done => {
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
                assert(res.status === 412)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
})
describe('Deleting users', () =>{
    xit('should delete a user if the correct id has been given', done => {
        User.findOne({
            username: "testUser"
        })
        .then((user) =>{
            request(app)
            .delete("/api/user")
            .send({ 
                _id: user._id,
                username: user.username,
                password: user.password
             })
            .end((err, res) =>{
                assert(res.status === 200)
            })
            return user
        })
        .then(() => {
           User.find({
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