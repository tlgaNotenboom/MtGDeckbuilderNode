const ApiError = require('../ApiError')
const Card = require('../models/card');
const Deck = require('../models/deck')


module.exports = {
    getAllCards(req, res, next){
        Card.find({})
        .then((cards)=>{
            if (cards.length !== 0) {
                res.status(200).send(cards);
            } else {
                throw new ApiError("No cards found", 404);
            }
        }).catch(next)
    },
    getSpecificCard(req, res, next){
        let cardname = req.params.cardname;
        Card.find({
            cardname: cardname
        })
        .then((cards)=>{
            if (cards.length == 1) {
                res.status(200).send(cards);
            } else {
                next(new ApiError("No card found named: "+cardname, 404));
            }
        })
        .catch(next)
    },
    addCard(req, res, next){
        let cardProps = req.body
        Card.find({
            cardname: cardProps.cardname
        })
        .then((foundCard) => {
            if (foundCard.length === 0) {
                Card.create(cardProps)
                .then(()=>{
                    res.status(200).send(cardProps)
                })
                .catch(next)
                return true;
            } else {
                throw new ApiError("Card '"+cardProps.cardname+"' already added", 409)
            }
        })
        .catch(next)
    },
    editCard(req, res, next){
        let cardname = req.body.cardname
        let update = req.body
        Card.findOne({
            cardname: cardname
        })
        .then((foundCard) => {
            if(foundCard != null){
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
            }else{ 
                throw new ApiError(cardname+" not found", 422); 
            }
        })
        .then(() => {
            res.status(200).send(update)
        })
        .catch(next)
    },
    removeCard(req, res, next){
        let cardId = req.params.id
        console.log("Before card.find")
        Card.find({
            _id: cardId
        })
        .then((foundCards) => {
            if(foundCards.length != 0){
                return Card.findByIdAndDelete(foundCards[0]._id)  
            }else{
                throw new ApiError("Invalid ID, card not found", 422);
            }
        })
        .then(() => {
            res.status(200).send("Card successfully deleted!")
        })
        .catch((err) => {
            console.log("err:")
            console.log(err)
            if(err.name == 'CastError'){
                next(new ApiError("Invalid ID, card not found", 422))
            }else{
                next(err)
            } 
        })
    }
}