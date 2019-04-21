const assert = require('assert')
const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const User = mongoose.model('user')

describe('Getting cards', () => {
    it('should return status 200 when a user is successfully added', done => {
        request(app)
            .post('/api/login')
            .send({
                username: "testUser",
                password: "123"
            })
            .end((err, res) => {
                assert(res.body.username == "testUser")
                assert(res.body.token)
                assert(res.status === 200)
                done()
            }) 
    })
})