let express = require('express');
let routes = express.Router();
let CardController = require('../controllers/card.controller')


routes.get("/card", CardController.getAllCards);
routes.get("/card/:id", CardController.getSpecificCard)

routes.post("/card", CardController.addCard);

routes.put("/card/:id", CardController.editCard)

routes.delete("/card/:id", CardController.removeCard);


module.exports = routes