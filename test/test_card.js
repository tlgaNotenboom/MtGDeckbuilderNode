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
            cardname: "Willing Test Subject",
            manaCost: "2/G",
            type: "Creature",
            subtype: "Spider Monkey Scientist",
            power: 2,
            toughness: 2,
            cardText: "Reach, Whenever you roll a 4 or higher on a die, put a +1/+1 counter on Willing Test Subject. (6): Roll a six-sided die."
            })
        .end((err, res) => {
            Card.find({
                cardname: "Willing Test Subject",
                manaCost: "2/G",
                type: "Creature",
                subtype: "Spider Monkey Scientist",
                power: 2,
                toughness: 2,
                cardText: "Reach, Whenever you roll a 4 or higher on a die, put a +1/+1 counter on Willing Test Subject. (6): Roll a six-sided die."
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
})