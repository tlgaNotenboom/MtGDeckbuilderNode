const ApiError = require('../ApiError')
const Card = require('../models/card');
const Deck = require('../models/deck')


module.exports = {
    getAllCards(req, res, next){
        Card.find({}, (err, cards) => {
            if (cards.length !== 0) {
                res.status(200).send(cards);
            } else {
                throw new ApiError("No cards found", 404);
            }
        }).catch((err) => {
            next(err)
        })
    },
    getSpecificCard(req, res, next){
        let cardname = req.params.cardname;
        Card.find({
            cardname: cardname
        }, (err, cards) => {
            if (cards) {
                res.status(200).send(cards);
            } else {
                next(new ApiError("No card found", 404));
            }
        });
    },
    addCard(req, res, next){
        let cardProps = req.body
        Card.find({
            cardname: cardProps.cardname
        })
        .then((foundCard) => {
            if (foundCard.length === 0) {
                Card.create(cardProps)
                return true;
            } else {
                throw new ApiError("Card \""+cardProps.cardname+"\" already added", 409)
            }
        })
        .then(()=>{
            res.status(200).send(cardProps)
        })
        .catch((err) => {
            next(err)
        })
    },
    editCard(req, res, next){
        let cardname = req.body.cardname
        let update = req.body
        Card.findOne({
            cardname: cardname
        })
        .then((foundCard) => {
            if(foundCard === undefined){
                throw new ApiError("Card not found", 422);
            }else{ 
                console.log(foundCard._id)
                return Card.findByIdAndUpdate({
                    _id: foundCard._id
                },
                {
                    manaCost: update.manaCost,
                    type: update.type,
                    subtype: update.subtype,
                    power: update.power,
                    toughness: update.toughness,
                    cardText: update.cardText,
                    flavorText: update.flavorText
                },
                {
                    runValidators: true,
                    new: true
                })
            }
        })
        .then(() => {
            res.status(200).send(update)
        })
        .catch((err) => {
            next(err)
        })
    },
    removeCard(req, res, next){
        let cardProps = req.body
        Card.find({
            cardname: cardProps.cardname
        })
        .then((foundCard) => {
            if(foundCard.length === 0){
                throw new ApiError("Card not found", 422);
            }else{
                return Card.findByIdAndDelete(foundCard._id)
            }
        })
        .then(() => {
            res.status(200).send("Card successfully deleted!")
        })
        .catch((err) => {
            next(err)
        })
    }
}