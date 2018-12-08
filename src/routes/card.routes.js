let express = require('express');
let routes = express.Router();
let CardController = require('../controllers/card.controller')


routes.get("/card", CardController.getAllCards);
routes.get("/card/:cardname", CardController.getSpecificCard)

routes.post("/card", CardController.addCard);

routes.post("/card/:user/:deckname", CardController.addCardToDeck)

routes.put("/card", CardController.editCard)

routes.delete("/card", CardController.removeCard);


module.exports = routes