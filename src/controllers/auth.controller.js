// Project files
const ApiError = require('../ApiError');
const authentication = require('../util/authentication');
const User = require('../models/user');

module.exports = {
    // Validate Token
    validateToken(req, res, next) {
        // Get token from header
        const token = req.header("x-access-token") || "";

        // Decode token
        authentication.decodeToken(token, (err, payload) => {
            if (err) {
                // Faulty token, throw new ApiError
                const error = new ApiError(err.message || err, 401);
                next(error);
            } else {
                // Token is correct
                req.user = payload.sub;
                next();
            }
        });
    },

    // Login user
    login(req, res, next) {
        let userRequest = req.body
        console.log('A login is being requested by: ' + userRequest.username);
        User.findOne({
                username: userRequest.username,
                password: userRequest.password
            })
            //because passwords in the database are not encrypted we can immediately check if the user and password match up.
            .then(user => {
                console.log('User was found in the database and a token is being made')
                //from here we'll add some login things
                console.log('this is your user ' + user._id)
                const payload = {
                    username: user.username,
                    _id: user._id
                }
                const userInfo = {
                    token: authentication.encodeToken(payload),
                    username: user.username,
                    status: 200
                }
                res.status(200).json(userInfo).end()
            })
            .catch((err) => {
                console.log(err)
                next(err)
            })
    },

    register(req, res, next) {
        const incomingData = req.body;
        console.log('New user requested! - ' + JSON.stringify(incomingData.username));
        if (incomingData.password1 == incomingData.password2 && incomingData.password1 != "") {

            const userData = {
                "username": incomingData.username,
                "password": incomingData.password1
            }
            User.find({
                    username: userData.username
                })
                .then((foundUser) => {
                    if (foundUser.length === 0) {
                        return User.create(userData)
                    } else {
                        throw new ApiError("User '" + userData.username + "' already exists", 409)
                    }
                })
                .then(user => {
                    console.log("User Created")
                    //User has been succesfully created
                    const payload = {
                        username: user.username,
                        _id: user._id
                    }
                    console.log("!!")
                    console.log(payload)
                    const userInfo = {
                        token: authentication.encodeToken(payload),
                        username: user.username,
                        message: 'You\'ve succesfully registered'
                    }
                    res.status(200).json(userInfo)
                    res.send()
                    console.log('Added new user - ' + user.username);
                })
                .catch(err => {
                    if (err.code === 409) {
                        // User already exists
                        res.status(409)
                        res.send(err)
                    } else {
                        // Unknown error
                        res.status(400);
                        res.send(new ApiError("Unknown error", 400));
                        console.log('Error whilst adding new user - ' + err);
                    }
                });
        } else {
            res.status(400)
            res.send(new ApiError("Passwords don't match", 400));
            console.log('Passwords don\'t match')
        }
    }
}