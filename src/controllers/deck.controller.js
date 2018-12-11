const ApiError = require('../ApiError')
const Deck = require('../models/deck');
const User = require('../models/user')
const Card = require('../models/card')
module.exports = {

    getAllDecks(req, res, next){
        Deck.find({}, (err, decks) => {
            if (decks.length !== 0) {
                res.status(200).send(decks);
            } else {
                throw new ApiError("No decks found", 404);
            }
        }).catch((err) => {
            next(err)
        })
    },
    getSpecificDeck(req, res, next){
        let username = req.params.user
        let deckName = req.params.deckname
        Deck.find({
            username: username,
            deckname: deckName
        }, (err, decks) => {
            if (decks) {
                res.status(200).send(decks);
            } else {
                next(new ApiError("No decks found", 404));
            }
        });
    },
    getDeckByUser(req, res, next){
        let username = req.params.user
        Deck.find({
            username: username
        }, (err, decks) => {
            if (decks) {
                res.status(200).send(decks);
            } else {
                next(new ApiError("No decks found", 404));
            }
        });
    },
    addDeck(req, res, next){
        const deckProps = req.body
        User.find({
            username: deckProps.username
        })
        .then((founduser)=>{
            if(founduser.length === 0){
                throw new ApiError("User not found", 422);
            }else{
                return
            }
        })
        .then(()=>{
            return Deck.find({
                username: deckProps.username,
                deckname: deckProps.deckname
            })
        })
        .then((foundDeck) => {
            if (foundDeck.length === 0) {
                return Deck.create(deckProps)
            } else {
                throw new ApiError("Deckname already taken", 409);
            }
        })
        .then(()=>{
            res.status(200).send(deckProps)
        })
        .catch((err) => {
            next(err)
        }) 
    },
    editDeck(req, res, next){
        let update = req.body
        let cardnames = update.deckList.map(card => card.cardname)
        Card.find({
            cardname:{
                $in: cardnames
            }
        },{
            _id: 1
        }
        )
        .then((foundIds) => {
            console.log(foundIds)
            // if(foundIds.length === 0){
            //     throw new ApiError("Deck not found", 422);
            // }else{
            //     console.log(update.deckList[0])
            //     return Deck.findByIdAndUpdate(
            //     foundDeck[0]._id,
            //     {
            //         // $addToSet:{
            //         //     deckList: update.deckList[0]
            //         // }    
            //     },
            //     {
            //         new: true
            //     })
            // }
        })
        .then(() => {
            res.status(200).send(update)
        })
        .catch((err) => {
            next(err)
        }) 
    },
    removeDeck(req, res, next){
        let deckProps = req.body
        Deck.find({
            username: deckProps.username,
            deckname: deckProps.deckname
        })
        .then((foundDeck) => {
            if(foundDeck.length === 0){
                throw new ApiError("Deck not found", 422);
            }else{
                return Deck.findByIdAndDelete(deckProps)
            }
        })
        .then(() => {
            res.status(200).send({success: "Deck successfully deleted!"})
        })
        .catch((err) => {
            next(err)
        })
    }
    
}