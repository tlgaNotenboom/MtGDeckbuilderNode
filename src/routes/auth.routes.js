let express = require('express');
let routes = express.Router();
let AuthController = require('../controllers/auth.controller')

routes.post("/login", AuthController.login);
routes.post("/register", AuthController.register);
routes.get("/validateToken", AuthController.validateToken);

module.exports = routes