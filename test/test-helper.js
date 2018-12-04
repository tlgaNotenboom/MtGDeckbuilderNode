const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../server')
const User = require('../src/models/user')
const Card = require('../src/models/card')
process.env.NODE_ENV = 'test'

before(done => {

    mongoose.connect("mongodb+srv://Admin:UJIv1hxtOlcMe0Tg@cluster0-md06d.azure.mongodb.net/test?retryWrites=true", { useNewUrlParser: true } );
    mongoose.connection
        .once('open', () => done())
        .on('error', err => {
            console.warn('Warning', err);
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
    const testCreature = new Card({
        cardname: "Willing Test Subject",
        manaCost: "2/G",
        type: "Creature",
        subtype: "Spider Monkey Scientist",
        power: 2,
        toughness: 2,
        cardText: "Reach, Whenever you roll a 4 or higher on a die, put a +1/+1 counter on Willing Test Subject. (6): Roll a six-sided die."
    })
    users.drop()
    .then(()=>{
        cards.drop()
        return
    })
    .then(() => {
        decks.drop()
        
    })
    .then(() =>{
       testUser.save()
       return
    })
    .then(()=> {
        testCreature.save()
        return
    })
    .then(() => done())
    .catch(() => done())
})
 