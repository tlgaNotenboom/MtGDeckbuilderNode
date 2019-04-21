const assert = require('assert')
const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const Card = mongoose.model('card')

describe('Getting cards', ()=>{
    it('should get all cards', done =>{
        request(app)
        .get('/api/card')
        .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
        .end((err, res) => {
            Card.find({
            })
            .then((foundCards)=>{
            assert(foundCards.length == res.body.length) 
            assert(res.status == 200)
            done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
    it('should need an x-access-token', done =>{
        request(app)
        .get('/api/card')
        .end((err, res) => {
            Card.find({
            })
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
    it('should get a specific card', done =>{
            Card.find({
                cardname: "Test Creature1"
            })
            .then((foundCards)=>{
                console.log(foundCards)
                request(app)
                .get('/api/card/'+foundCards[0].cardname)
                .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
                .end((err, res) => {
                    console.log(res.body)
                    assert(res.body[0].cardname == 'Test Creature1') 
                    assert(res.status == 200)
                    done()
                })
            })
            .catch((err) => {
                done(err)
            })
            
    })
})
describe('Creating a card', ()=>{
    it('should create a new card Creature card', done =>{
        request(app)
        .post('/api/card')
        .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
        .send({
            cardname: "createdTestCard",
            manaCost: "2/G",
            type: "Creature",
            subtype: "Scientist",
            power: 2,
            toughness: 2,
            cardText: "test Card"
            })
        .end((err, res) => {
            Card.find({
                cardname: "createdTestCard",
                manaCost: "2/G",
                type: "Creature",
                subtype: "Scientist",
                power: 2,
                toughness: 2,
                cardText: "test Card"
            })
            .then((foundCards)=> {
                assert(foundCards.length === 1)
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
        .post('/api/card')
        .send({
            cardname: "createdTestCard",
            manaCost: "2/G",
            type: "Creature",
            subtype: "Scientist",
            power: 2,
            toughness: 2,
            cardText: "test Card"
            })
        .end((err, res) => {
            Card.find({
                cardname: "createdTestCard",
                manaCost: "2/G",
                type: "Creature",
                subtype: "Scientist",
                power: 2,
                toughness: 2,
                cardText: "test Card"
            })
            .then((foundCards)=> {
                assert(foundCards.length === 0)
                assert(res.status === 401)
                assert(res.body.error == "No token supplied")
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    }),
    it('should return status 409 if the cardname already exists', done =>{
        request(app)
        .post('/api/card')
        .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
        .send({
            cardname: "Test Creature1",
            manaCost: "0",
            type: "Enchantment",
            subtype: "Aura",
            cardText: "If tested with status 409, win"
            })  
        .end((err, res) => {
            Card.find({
                cardText: "If tested with status 409, win"
            })
            .then((foundCards)=> {
                assert(foundCards.length === 0)
                assert(res.status === 409)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
}),
describe('Editing a card', ()=>{
    it('Should edit a card', done =>{
        request(app)
        .put('/api/card')
        .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
        .send({
            cardname: "Test Creature1",
            manaCost: "10",
            type: "edited Enchantment",
            subtype: "edited Aura",
            cardText: "If edited with a status code 200, win"
        })
        .end((err, res) =>{
            Card.find({
                cardname: "Test Creature1",
                manaCost: "10",
                type: "edited Enchantment",
                subtype: "edited Aura",
                cardText: "If edited with a status code 200, win"
            })
            .then((foundCards)=> {
                assert(foundCards.length === 1)
                assert(res.status === 200)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
    it('Should need an x-access-token', done =>{
        request(app)
        .put('/api/card')
        .send({
            cardname: "Test Creature1",
            manaCost: "10",
            type: "edited Enchantment",
            subtype: "edited Aura",
            cardText: "If edited with a status code 200, win"
        })
        .end((err, res) =>{
            Card.find({
                cardname: "Test Creature1",
                manaCost: "10",
                type: "edited Enchantment",
                subtype: "edited Aura",
                cardText: "If edited with a status code 200, win"
            })
            .then((foundCards)=> {
                assert(foundCards.length === 0)
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
describe('Deleting a card', ()=>{
    it('should delete a card', done =>{
        Card.find({
            cardname: "Test Creature1"
        })
        .then((foundCards)=>{
            console.log(foundCards)
            request(app)
            .delete('/api/card/'+foundCards[0]._id)
            .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
            .end((err, res) => {
                Card.find({
                    cardname: "Test Creature 1"
                })
                .then((foundCards)=>{
                    console.log(res.body)
                    assert(foundCards.length == 0) 
                    assert(res.status == 200)
                    done()
                })
                .catch((err) => {
                    done(err)
                }) 
            })
        })
        .catch((err) => {
            done(err)
        })   
    })
    it('should need an x-access-token', done =>{
        Card.find({
            cardname: "Test Creature1"
        })
        .then((foundCards)=>{
            console.log(foundCards)
            request(app)
            .delete('/api/card/'+foundCards[0]._id)
            .end((err, res) => {
                Card.find({
                    cardname: "Test Creature 1"
                })
                .then(()=>{
                    assert(res.status === 401)
                    assert(res.body.error == "No token supplied")
                    done()
                })
            })
        })
        .catch((err) => {
            done(err)
        })   
    })
    //crashes
    it('should error when the wrong id is given', done =>{
        Card.find({
            cardname: "Test Creature1"
        })
        .then((foundCards)=>{
            request(app)
            .delete('/api/card/000')
            .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTY2NDQ4MDUsImlhdCI6MTU1NTc4MDgwNSwic3ViIjp7InVzZXJuYW1lIjoieHkiLCJfaWQiOiI1Y2IwNTQ1ZTE1YTYyNzIzM2NiNDNhZTAifX0.KUJFAK9HPrsQjLUGGh6Zh68tUjce5WctsEGf4-m65XM')
            .end((err, res) => {
                Card.find({
                    cardname: "Test Creature 1"
                })
                .then((foundCards)=>{
                    assert(res.body.error == "Invalid ID, card not found")
                    assert(res.status == 422)
                    done()
                })
            })
        })
        .catch((err) => {
            done(err)
        })   
    })
})