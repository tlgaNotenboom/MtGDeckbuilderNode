const ApiError = require('../ApiError')
const User = require('../models/user');

module.exports = {
    getAllUsers(req, res, next){
        User.find({}, (err, users) => {
            if (users.length !== 0) {
                res.status(200).send(users);
            } else {
                next(new ApiError("No users found", 404));
            }
        }).catch((err) => {
            next(new ApiError(err.toString(), 400))
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
                if(userProps.password.length > 2){
                    User.create(userProps)
                    return true;
                }else{
                    next(new ApiError("Password has to be longer than 2 characters", 412))
                    return false;
                } 
            } else {
                next(new ApiError("Username already taken", 409))
                return false;
            }
        })
        .then(()=>{
            res.status(200).send(userProps)
        })
        .catch((err) => {
            next(new ApiError(err.toString(), 400))
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
                next(new ApiError("User not found", 422));
            }else{
                return User.findByIdAndDelete(userProps)
            }
        })
        .then(() => {
            res.status(200).send({success: "User successfully deleted!"})
        })
    }
}
