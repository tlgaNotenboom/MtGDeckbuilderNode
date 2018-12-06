const ApiError = require('../ApiError')
const User = require('../models/user');

module.exports = {
    getAllUsers(req, res, next){
        User.find({}, (err, users) => {
            if (users.length !== 0) {
                res.status(200).send(users);
            } else {
                throw new ApiError("No users found", 404)
            }
        }).catch((err) => {
            next(err)
        })
    },
    getSpecificUser(req, res, next){
        const username = req.params.username;
            User.findOne({
                username: username
            }, (err, user) => {
                if (user) {
                    res.status(200).send(user);
                } else {
                    next(new ApiError("No users found", 404));
                }
            });
    },
    addUser(req, res, next){
        const userProps = req.body
        User.find({
            username: userProps.username
        })
        .then((foundUser) => {
            if (foundUser.length === 0) {
                return User.create(userProps)
            } else {
                throw new ApiError("Username already taken", 409)
            }
        })
        .then(()=>{
            res.status(200).send(userProps)
        })
        .catch((err) => {
            next(err)
        })
    },
    removeUser(req, res, next){
        let userProps = req.body
        User.find({
            username: userProps.username,
            password: userProps.password
        })
        .then((foundUser) => {
            if(foundUser.length === 0){
                throw new ApiError("User not found", 422);
            }else{
                return User.findByIdAndDelete(userProps._id)
            }
        })
        .then(() => {
            res.status(200).send("User successfully deleted!")
        })
        .catch((err) => {
            next(err)
        })
    }
}
