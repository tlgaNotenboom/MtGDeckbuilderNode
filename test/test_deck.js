const assert = require('assert')
const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const Card = mongoose.model('card')
const Deck = mongoose.model('deck')

describe('Creating a deck', ()=>{
    
})