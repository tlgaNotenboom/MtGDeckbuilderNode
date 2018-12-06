const ApiError = require('../ApiError')
const Deck = require('../models/deck');

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
        Deck.find({
            username: deckProps.username,
            deckname: deckProps.deckname
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
        let username = req.body.username
        let deckName = req.body.deckname
        let update = req.body
        Deck.find({
            username: username,
            deckname: deckName
        })
        .then((foundDeck) => {
            if(foundDeck.length === 0){
                throw new ApiError("Deck not found", 422);
            }else{
                return Deck.findByIdAndUpdate({
                    _id: foundDeck[0]._id
                },
                {
                    $set:{
                        deckname: update.deckname,
                        decklist: update.decklist
                    }    
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