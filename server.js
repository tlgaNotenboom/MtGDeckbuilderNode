const Mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express')
const ApiError = require('./src/ApiError')
const user_routes = require('./src/routes/user.routes')
const card_routes = require('./src/routes/card.routes')
const deck_routes = require('./src/routes/deck.routes')
const morgan = require('morgan')

    if(process.env.NODE_ENV !== 'test'){
		console.log("Mongoose is connected to production Atlas remote DB")
        Mongoose.connect("mongodb+srv://Admin:UJIv1hxtOlcMe0Tg@cluster0-md06d.azure.mongodb.net/production?retryWrites=true", { useNewUrlParser: true } );
	}

Mongoose.connection
    .once('open', () => console.log("Mongoose: connection open"))
	.on("error", (err) => console.warn("Error", err))
	
const port = process.env.PORT || 3000

let app = express();

app.use(bodyParser.json())

app.use(morgan("dev"));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || 'http://localhost:4200' || 'https://client-side-deckbuilder-app.herokuapp.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    if (req.method === 'OPTIONS') {
        res.status(200);
        res.end();
    } else {
        next();
    }
});

app.use("*", function(req, res, next) {
    next();
});

app.use('/api', user_routes);
app.use('/api', card_routes);
app.use('/api', deck_routes);

app.use('*', (req, res, next) => {
	console.log('Non-existing endpoint');
	const error = new ApiError("Non existant endpoint", 404);
	next(error);
});

app.use((err, req, res, next) => {
	console.log(err);
	res.status(err.code).send(err);
});

app.listen(port, () => {
	console.log('Server running on port ' + port);
});

module.exports = app;