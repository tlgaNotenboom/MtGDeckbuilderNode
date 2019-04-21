let express = require('express');
let routes = express.Router();
let UserController = require('../controllers/user.controller')

routes.get("/user", UserController.getAllUsers);

routes.post("/user", UserController.addUser);

routes.put("/user/", UserController.editUser);

routes.delete("/user", UserController.removeUser);


module.exports = routes