const ApiError = require('../ApiError')
const User = require('../models/user');

module.exports = {
    getAllUsers(req, res, next){
        User.find({})
        .then((users)=>{
            if (users.length !== 0) {
                res.status(200).send(users);
            } else {
                throw new ApiError("No users found", 404);
            }
        }).catch(next)
    },
    addUser(req, res, next){
        if(req.body.password == req.body.password2){
            delete req.body.password2;
            const userProps = req.body;
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
        }else{
            let err = new ApiError("Passwords do not match", 400)
            next(err)
        }
    },
    editUser(req, res, next){
        let username = req.body.username
        let password = req.body.password
        delete req.body.password
        let update = req.body
        User.findOne({
            username: username,
            password: password
        })
        .then((foundUser) => {
            if(foundUser != null){
                console.log(foundUser._id)
                return User.findByIdAndUpdate({
                    _id: foundUser._id
                },
                {
                    password: update.newpassword
                },
                {
                    runValidators: true,
                    new: true
                })
            }else{ 
                throw new ApiError(username+" not found", 422); 
            }
        })
        .then(() => {
            res.status(200).send(update)
        })
        .catch(next)
    },
    removeUser(req, res, next){
        let userProps = req.body
        User.find({
            username: userProps.username,
            password: userProps.password
        })
        .then((foundUsers) => {
            if(foundUsers != ""){
                console.log(foundUsers)
                if(foundUsers.decks != undefined){
                    while(foundUsers.decks.length != 0){
                        Deck.findOneAndDelete(foundUsers.decks[0]._id)
                    }
                }
                return User.findByIdAndDelete(foundUsers[0]._id)
            }else{
                throw new ApiError("User not found", 404);
            }
        })
        .then((user) => {
            console.log(user)
            res.status(200).send("User successfully deleted!")
        })
        .catch((err) => {
            next(err)
        })
    }
}
