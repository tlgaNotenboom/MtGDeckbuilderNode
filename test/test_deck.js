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
        .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
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
    }),
    it('should need an x-access-token', done =>{
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
                assert(foundDeck.length === 0)
                assert(res.status === 401)
                assert(res.body.error == "No token supplied")
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    }),
    it('should fail when a non existant username is used', done =>{
        request(app)
        .post('/api/deck')
        .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
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
        .put('/api/deck/')
        .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
        .send({
            username: "testUser",
            deckname: "testDeck",
            deckList: [{
                cardname: "Test Creature1"
            },{
                cardname: "Test Creature2"
            }]
        })
        .end((err, res) => {
            Deck.find({
                username: "testUser",
                deckname: "testDeck"
            })
            .then((foundDeck)=> {
                assert(foundDeck[0].deckList.length === 2)
                assert(res.status === 200)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    }),
    it('should need an x-access-token', done =>{
        request(app)
        .put('/api/deck/')
        .send({
            username: "testUser",
            deckname: "testDeck",
            deckList: [{
                cardname: "Test Creature1"
            },{
                cardname: "Test Creature2"
            }]
        })
        .end((err, res) => {
                assert(res.status === 401)
                assert(res.body.error == "No token supplied")
                done()
        })
    })
})
describe('Deleting a deck', ()=>{
    it('should remove a deck', done =>{
        request(app)
        .delete('/api/deck/')
        .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
        .send({
            username: "testUser",
            deckname: "testDeck",
        })
        .end((err, res) => {
            Deck.find({
                username: "testUser",
                deckname: "testDeck"
            })
            .then((foundDeck)=> {
                assert(foundDeck.length === 0)
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
        .delete('/api/deck/')
        .send({
            username: "testUser",
            deckname: "testDeck",
        })
        .end((err, res) => {
            Deck.find({
                username: "testUser",
                deckname: "testDeck"
            })
            .then((foundDeck)=> {
                assert(res.status === 401)
                assert(res.body.error == "No token supplied")
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
    it('should not remove a deck if the username is wrong', done =>{
        request(app)
        .delete('/api/deck/')
        .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
        .send({
            username: "WrongUsername",
            deckname: "testDeck",
        })
        .end((err, res) => {
            Deck.find({
                username: "testUser",
                deckname: "testDeck"
            })
            .then((foundDeck)=> {
                assert(foundDeck.length === 1)
                assert(res.status === 422)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
    it('should not remove a deck if the deckname is wrong', done =>{
        request(app)
        .delete('/api/deck/')
        .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
        .send({
            username: "testUser",
            deckname: "WrongDeckname",
        })
        .end((err, res) => {
            Deck.find({
                username: "testUser",
                deckname: "testDeck"
            })
            .then((foundDeck)=> {
                assert(foundDeck.length === 1)
                assert(res.status === 422)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
})
    describe('Getting a deck', ()=>{
        it('should get all decks of a user', done =>{
            request(app)
            .get('/api/deck/testUser')
            .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
            .end((err, res) => {
                Deck.find({
                    username: "testUser"
                })
                .then((foundDecks)=> {
                    assert(foundDecks.length === res.body.length)
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
        .get('/api/deck/testUser')
        .end((err, res) => {
            Deck.find({
                username: "testUser"
            })
            .then(()=> {
                assert(res.status === 401)
                assert(res.body.error == "No token supplied")
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
})
    it('should get a specific decks of a user', done =>{
        request(app)
        .get('/api/deck/testUser/testDeck')
        .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
        .end((err, res) => {
            Deck.find({
                username: "testUser",
                deckname: "testDeck"
            })
            .then((foundDecks)=> {
                assert(foundDecks[0].deckList.length === res.body[0].deckList.length)
                assert(res.status === 200)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
    it('should get a specific decks of a user', done =>{
        request(app)
        .get('/api/deck/testUser/testDeck')
        .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
        .end((err, res) => {
            Deck.find({
                username: "testUser",
                deckname: "testDeck"
            })
            .then((foundDecks)=> {
                assert(foundDecks[0].deckList.length === res.body[0].deckList.length)
                assert(res.status === 200)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
    it('should return a 404 if the user does not exist', done =>{
        request(app)
        .get('/api/deck/nonExistingUser')
        .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
        .end((err, res) => {
                assert(res.body.error ==='No decks found')
                assert(res.status === 404)
                done()
            })
        })
    it('should return a 422 if the deck does not exist', done =>{
        request(app)
        .get('/api/deck/testUser/nonExistingDeck')
        .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
        .end((err, res) => {
                assert(res.body.error ==="No decks found")
                assert(res.status === 404)
                done()
            })
        })    
})