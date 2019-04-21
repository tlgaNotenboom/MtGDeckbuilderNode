const moment = require('moment')
const jwt = require('jwt-simple')

// Get secret key from settings
const settings = require('../config/config')

//Encoderen van data
function encodeToken(data) {
    //Payload om een token mee te maken
    const payload = {
        exp: moment().add(10, 'days').unix(),
        iat: moment().unix(),
        sub: data
    }
    //Encoding terugsturen
    return jwt.encode(payload, settings.secretkey)
}
//Decoderen van data
function decodeToken(token, callback) {
    try {
        //Payload decoderen
        const payload = jwt.decode(token, settings.secretkey)

        //Token is te oud?
        const now = moment().unix()
        if (now > payload.exp) {
            callback('Token has expired!', null)
        } else {
            callback(null, payload)
        }
    } catch (err) {
        //Error
        callback(err, null)
    }
}

//Methoden exporteren
module.exports = {
    encodeToken,
    decodeToken
}