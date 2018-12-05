const ApiError = require('../ApiError')
const Card = require('../models/card');


module.exports = {
    getAllCards(req, res, next){
        Card.find({}, (err, cards) => {
            if (cards.length !== 0) {
                res.status(200).send(cards);
            } else {
                next(new ApiError("No cards found", 404));
            }
        }).catch((err) => {
            next(new ApiError(err.toString(), 400))
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
                next(new ApiError("Card \""+cardProps.cardname+"\" already added", 409))
                return false;
            }
        })
        .then(()=>{
            res.status(200).send(cardProps)
        })
        .catch((err) => {
            next(new ApiError(err.toString(), 400))
        })
    },
    editCard(req, res, next){
        let cardname = req.body.cardname
        let update = req.body
        Card.find({
            cardname: cardname
        })
        .then((foundCard) => {
            if(foundCard.length === 0){
                next(new ApiError("Card not found", 422));
            }else{
                return Card.findByIdAndUpdate({
                    _id: update._id
                },
                {
                    $set:{
                        cardname: update.cardname,
                        manaCost: update.manaCost,
                        type: update.type,
                        subtype: update.subtype,
                        power: update.power,
                        toughness: update.toughness,
                        cardText: update.cardText,
                        flavorText: update.flavorText
                    }    
                },
                {
                    runValidators: true,
                    new: true
                })
            }
        })
        .then(() => {
            res.status(200).send("Card successfully edited")
        })
        .catch((err) => {
            next(new ApiError(err.toString(), 400))
        })
    },
    removeCard(req, res, next){
        let cardName = req.body.cardname
        Card.find({
            cardname: cardName
        })
        .then((foundCard) => {
            if(foundCard.length === 0){
                next(new ApiError("Card not found", 422));
            }else{
                return Card.findByIdAndDelete(foundCard._id)
            }
        })
        .then(() => {
            res.status(200).send({success: "Card successfully deleted"})
        })
        .catch((err) => {
            next(new ApiError(err.toString(), 400))
        })
    }
}