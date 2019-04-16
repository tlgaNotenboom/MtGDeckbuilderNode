const Mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express')
const ApiError = require('./src/ApiError')
const user_routes = require('./src/routes/user.routes')
const card_routes = require('./src/routes/card.routes')
const deck_routes = require('./src/routes/deck.routes')
const auth_routes = require('./src/routes/auth.routes')
const AuthController = require('./src/controllers/auth.controller')
const morgan = require('morgan')
var cors = require('cors')

    if(process.env.NODE_ENV !== 'test'){
		console.log("Mongoose is connected to production Atlas remote DB")
        Mongoose.connect("mongodb+srv://Admin:UJIv1hxtOlcMe0Tg@cluster0-md06d.azure.mongodb.net/production?retryWrites=true", { useNewUrlParser: true } );
	}

Mongoose.connection
    .once('open', () => console.log("Mongoose: connection open"))
	.on("error", (err) => console.warn("Error", err))
	
const port = process.env.PORT || 3000

let app = express();

app.use(cors())

app.use(bodyParser.json())

app.use(morgan("dev"));

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*'); // 'http://localhost:4200');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization,Authorization');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});


app.use('/api', auth_routes)
app.all('*', AuthController.validateToken)
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
	res.status(err.code || err.status || 500).send({error: err.message})	
});

app.listen(port, () => {
	console.log('Server running on port ' + port);
});

module.exports = app;