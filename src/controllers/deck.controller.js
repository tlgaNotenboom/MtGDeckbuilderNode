const ApiError = require('../ApiError')
const Deck = require('../models/deck');

module.exports = {

    getAllDecks(req, res, next){
        Deck.find({}, (err, decks) => {
            if (decks.length !== 0) {
                res.status(200).send(decks);
            } else {
                next(new ApiError("No decks found", 404));
            }
        }).catch((err) => {
            next(new ApiError(err.toString(), 400))
        })
    },
    getSpecificDeck(req, res, next){
        const deckId = req.params.id;
        Deck.findById({
            _id: deckId
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
                Deck.create(deckProps)
                return true;
            } else {
                next(new ApiError("Deckname already taken", 409))
                return false;
            }
        })
        .then(()=>{
            res.status(200).send(deckProps)
        })
        .catch((err) => {
            next(new ApiError(err.toString(), 400))
        }) 
    },
    editDeck(req, res, next){
        let deckId = req.params.id
        let update = req.body
        Deck.find({
            _id: deckId
        })
        .then((foundDeck) => {
            if(foundDeck.length === 0){
                next(new ApiError("Deck not found", 422));
            }else{
                return Deck.findByIdAndUpdate({
                    _id: deckId
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
            res.status(200).send("Deck successfully edited")
        })
        .catch((err) => {
            next(new ApiError(err.toString(), 400))
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
                next(new ApiError("Deck not found", 422));
            }else{
                return Deck.findByIdAndDelete(deckProps)
            }
        })
        .then(() => {
            res.status(200).send({success: "Deck successfully deleted!"})
        })
    }
    
}