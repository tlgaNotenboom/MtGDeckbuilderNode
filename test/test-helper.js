const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../server')
const User = require('../src/models/user')
const Card = require('../src/models/card')
const Deck = require('../src/models/deck')
process.env.NODE_ENV = 'test'

before(done => {
    mongoose.connect("mongodb+srv://Thomas:123@cluster0-md06d.azure.mongodb.net/test?retryWrites=true", { useNewUrlParser: true } );
    mongoose.connection
        .once('open', () => done())
        .on('error', err => {
            console.warn('Warning', err);
            done(err)
        });
});

beforeEach((done) => {
    const {
        users,
        cards,
        decks
    } = mongoose.connection.collections;
    const testUser = new User ({
        username: "testUser",
        password: "123"
    })
    const testCreature1 = new Card({
        cardname: "Test Creature1",
        manaCost: "2/G",
        type: "Creature",
        subtype: "testCreature",
        power: 2,
        toughness: 2,
        cardText: "If tested, win"
    })
    const testCreature2 = new Card({
        cardname: "Test Creature2",
        manaCost: "2/G",
        type: "Creature",
        subtype: "testCreature",
        power: 2,
        toughness: 2,
        cardText: "If tested, win"
    })
    const testDeck = new Deck({
        username: "testUser",
        deckname: "testDeck",
        deckList:[{
            cardname: "Test Creature",
            manaCost: "2/G",
            type: "Creature",
            subtype: "testCreature",
            power: 2,
            toughness: 2,
            cardText: "If tested, win"
        }]
    })
    mongoose.connection.db.dropDatabase()
    .then(()=>{
       return users.insertOne(testUser)
    })
    .then(()=>{
        return cards.insertOne(testCreature1)
    })
    .then(()=>{
        return cards.insertOne(testCreature2)
    })
    .then(()=>{
        return decks.insertOne(testDeck)
    })
    .then(()=>{
        done()
    })
    .catch((err)=>{
        done(err)
    })
})