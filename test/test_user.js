const assert = require('assert')
const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const User = mongoose.model('user')

describe('Creating users', () =>{
    it('works', done =>{
        assert(true)
        done()
    })
});