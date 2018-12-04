const Mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express')
const ApiError = require('./src/ApiError')
const user_routes = require('./src/routes/user.routes')
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

app.use("*", function(req, res, next) {
    next();
});

app.use('/api', user_routes);

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