const assert = require('assert')
const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const Card = mongoose.model('card')

describe('Creating a card', ()=>{
    it('should create a new card Creature card', done =>{
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
                assert(foundCards.length === 1)
                assert(res.status === 200)
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
        .send({
            cardname: "Test Creature",
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
        .send({
            cardname: "Test Creature",
            manaCost: "10",
            type: "edited Enchantment",
            subtype: "edited Aura",
            cardText: "If edited with a status code 200, win"
        })
        .end((err, res) =>{
            Card.find({
                cardname: "Test Creature",
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
}),
xdescribe('Deleting a card', ()=>{
    it('Should delete a card when correct', done =>{
        request(app)
        .delete('/api/card')
        .send({
            cardname:"Test Creature"
        })
        .end((err, res)=>{
            Card.find({
                cardname: "Test Creature"
            })
            .then((foundcards)=>{
                assert(foundcards.length === 0)
                assert(res.status === 200)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })

    })
})