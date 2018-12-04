let express = require('express');
let routes = express.Router();
let DeckController = require('../controllers/deck.controller')


routes.get("/deck", DeckController.getAllDecks);
routes.get("/deck/:id", DeckController.getSpecificDeck)

routes.post("/deck", DeckController.addDeck);

routes.put("/deck", DeckController.editDeck);

routes.delete("/deck", DeckController.removeDeck);

module.exports = routes