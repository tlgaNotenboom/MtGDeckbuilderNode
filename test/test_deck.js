const assert = require('assert')
const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const Card = mongoose.model('card')
const Deck = mongoose.model('deck')

describe('Creating a deck', ()=>{
    it('should create a new Deck', done =>{
        request(app)
        .post('/api/deck')
        .send({
            username: "testUser",
            deckname: "createdTestDeck"
        })
        .end((err, res) => {
            Deck.find({
                username: "testUser",
                deckname: "createdTestDeck"
            })
            .then((foundDeck)=> {
                assert(foundDeck.length === 1)
                assert(res.status === 200)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
    it('should fail when a non existant username is used', done =>{
        request(app)
        .post('/api/deck')
        .send({
            username: "non-existant user",
            deckname: "failedToCreateDeck"
        })
        .end((err, res) => {
            Deck.find({
                username: "non-existant user",
                deckname: "createdTestDeck"
            })
            .then((foundDeck)=> {
                assert(foundDeck.length === 0)
                assert(res.status === 422)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
})

describe('Editing a deck', ()=>{
    it('should add a decklist to a deck', done =>{
        request(app)
        .put('api/deck/')
        .send({
            username: "testUser",
            deckname: "testDeck",
            deckList: [{
                cardname: "Test Creature1"
            },{
                cardname: "Test Creature2"
            }],
        })
        .end((err, res) => {
            Deck.findOne({
                username: "testUser",
                deckname: "testDeck"
            })
            .then((foundDeck)=> {
                console.log(foundDeck.deckList)
                assert(foundDeck.deckList.length === 2)
                assert(res.status === 200)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
})